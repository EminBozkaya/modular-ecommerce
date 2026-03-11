using ECommerce.Domain.Ordering;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ECommerce.Application.Payment.VerifyPaymentWebhook;

public class VerifyPaymentWebhookHandler : IRequestHandler<VerifyPaymentWebhookCommand, VerifyPaymentWebhookResponse>
{
    private readonly IPaymentRepository _payments;
    private readonly IOrderRepository _orders;
    private readonly IEnumerable<IPaymentProvider> _providers;
    private readonly ILogger<VerifyPaymentWebhookHandler> _logger;

    public VerifyPaymentWebhookHandler(
        IPaymentRepository payments,
        IOrderRepository orders,
        IEnumerable<IPaymentProvider> providers,
        ILogger<VerifyPaymentWebhookHandler> logger)
    {
        _payments = payments;
        _orders = orders;
        _providers = providers;
        _logger = logger;
    }

    public async Task<VerifyPaymentWebhookResponse> Handle(
        VerifyPaymentWebhookCommand cmd, CancellationToken ct)
    {
        // 1. Provider lookup
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(cmd.ProviderName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
        {
            _logger.LogWarning("Webhook received for unknown provider '{Provider}'.", cmd.ProviderName);
            return new VerifyPaymentWebhookResponse(false, null, $"Unknown provider: {cmd.ProviderName}");
        }

        // 2. Provider verification (signature check is inside provider)
        var verifyRequest = new PaymentVerifyRequest(
            OrderId: string.Empty, // will be resolved from payload
            ProviderReference: string.Empty,
            RawPayload: cmd.RawBody,
            Headers: cmd.Headers);

        var verifyResult = await provider.VerifyPaymentAsync(verifyRequest, ct);

        // 3. Invalid signature
        if (!verifyResult.IsSuccess && verifyResult.ErrorCode == "invalid_signature")
        {
            _logger.LogWarning(
                "Payment.Webhook.InvalidSignature. Provider={Provider}",
                cmd.ProviderName);
            return new VerifyPaymentWebhookResponse(false, null, "Invalid signature");
        }

        // 4. Find PaymentRecord by provider reference (embedded in payload by provider)
        //    Stub and other providers may not provide ProviderReference in verify — skip if null
        if (verifyResult.TransactionId is null && verifyResult.ResultStatus == PaymentStatus.Pending)
        {
            // Non-actionable event (e.g. Stripe event type we don't handle) — return 200 to prevent retries
            return new VerifyPaymentWebhookResponse(true, null, null);
        }

        // Attempt to find PaymentRecord — the provider returns TransactionId; we need ProviderReference
        // For Stripe: ProviderReference = session ID, TransactionId = payment_intent ID
        // We search by various means. For simplicity, handler expects ProviderReference in verifyRequest
        // The webhook controller must enrich the command with the order ID from the payload when possible.
        // Here we search by TransactionId as a fallback ProviderReference search.
        var paymentRecord = verifyResult.TransactionId is not null
            ? await _payments.GetByProviderReferenceAsync(verifyResult.TransactionId, ct)
            : null;

        if (paymentRecord is null)
        {
            _logger.LogWarning(
                "Payment.Webhook.PaymentRecordNotFound. Provider={Provider}, TransactionId={TxId}",
                cmd.ProviderName, verifyResult.TransactionId);
            // Return 200 to prevent provider from retrying for records we can't find
            return new VerifyPaymentWebhookResponse(true, null, null);
        }

        var orderId = paymentRecord.OrderId.ToString();

        // 5. Idempotency — already completed
        if (paymentRecord.Status == PaymentStatus.Completed)
        {
            if (paymentRecord.ProviderTransactionId != verifyResult.TransactionId)
            {
                _logger.LogWarning(
                    "Payment.Webhook.Idempotent but TransactionId mismatch. OrderId={OrderId}, " +
                    "Stored={Stored}, Received={Received}",
                    orderId, paymentRecord.ProviderTransactionId, verifyResult.TransactionId);
            }
            return new VerifyPaymentWebhookResponse(true, orderId, null);
        }

        if (paymentRecord.IsTerminal)
            return new VerifyPaymentWebhookResponse(true, orderId, null);

        // 6. Amount verification (fraud prevention)
        if (verifyResult.VerifiedAmount is not null)
        {
            if (verifyResult.VerifiedAmount.Amount != paymentRecord.Amount.Amount ||
                verifyResult.VerifiedAmount.Currency != paymentRecord.Amount.Currency)
            {
                _logger.LogError(
                    "Payment.Webhook.AmountMismatch. OrderId={OrderId}, " +
                    "Expected={Expected} {Currency}, Received={Received} {ReceivedCurrency}",
                    orderId,
                    paymentRecord.Amount.Amount, paymentRecord.Amount.Currency,
                    verifyResult.VerifiedAmount.Amount, verifyResult.VerifiedAmount.Currency);

                paymentRecord.MarkFailed("Amount mismatch — possible fraud", cmd.RawBody);
                await _payments.SaveChangesAsync(ct);
                return new VerifyPaymentWebhookResponse(false, orderId, "Amount mismatch");
            }
        }

        // 7. Update PaymentRecord
        if (verifyResult.IsSuccess)
        {
            paymentRecord.MarkCompleted(verifyResult.TransactionId!, cmd.RawBody);

            // Update Order status
            var order = await _orders.GetByIdTrackedAsync(paymentRecord.OrderId, ct);
            order?.MarkAsPaid();

            _logger.LogInformation(
                "Payment.Webhook.Verified. OrderId={OrderId}, Provider={Provider}, TransactionId={TxId}",
                orderId, cmd.ProviderName, verifyResult.TransactionId);
        }
        else
        {
            paymentRecord.MarkFailed(verifyResult.ErrorMessage ?? "Payment failed", cmd.RawBody);

            _logger.LogWarning(
                "Payment.Webhook.Failed. OrderId={OrderId}, Provider={Provider}, ErrorCode={Code}",
                orderId, cmd.ProviderName, verifyResult.ErrorCode);
        }

        await _payments.SaveChangesAsync(ct);

        return new VerifyPaymentWebhookResponse(verifyResult.IsSuccess, orderId, verifyResult.ErrorMessage);
    }
}
