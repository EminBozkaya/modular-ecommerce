using ECommerce.Domain.Ordering;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ECommerce.Application.Payment.VerifyPaymentCallback;

public class VerifyPaymentCallbackHandler : IRequestHandler<VerifyPaymentCallbackCommand, VerifyPaymentCallbackResponse>
{
    private readonly IPaymentRepository _payments;
    private readonly IOrderRepository _orders;
    private readonly IEnumerable<IPaymentProvider> _providers;
    private readonly ILogger<VerifyPaymentCallbackHandler> _logger;

    public VerifyPaymentCallbackHandler(
        IPaymentRepository payments,
        IOrderRepository orders,
        IEnumerable<IPaymentProvider> providers,
        ILogger<VerifyPaymentCallbackHandler> logger)
    {
        _payments = payments;
        _orders = orders;
        _providers = providers;
        _logger = logger;
    }

    public async Task<VerifyPaymentCallbackResponse> Handle(
        VerifyPaymentCallbackCommand cmd, CancellationToken ct)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(cmd.ProviderName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
        {
            _logger.LogWarning("Callback received for unknown provider '{Provider}'.", cmd.ProviderName);
            return new VerifyPaymentCallbackResponse(false, null, $"Unknown provider: {cmd.ProviderName}");
        }

        var order = await _orders.GetByIdTrackedAsync(cmd.OrderId, ct);
        if (order is null)
        {
            return new VerifyPaymentCallbackResponse(false, null, "Order not found");
        }

        var paymentRecord = await _payments.GetByOrderIdAndStatusAsync(cmd.OrderId, PaymentStatus.Processing, ct);
        if (paymentRecord is null)
        {
            // Payment might already be completed/failed by a webhook. Check if it's terminal.
            paymentRecord = await _payments.GetByOrderIdAndStatusAsync(cmd.OrderId, PaymentStatus.Completed, ct)
                ?? await _payments.GetByOrderIdAndStatusAsync(cmd.OrderId, PaymentStatus.Failed, ct);

            if (paymentRecord is not null && paymentRecord.IsTerminal)
            {
                return new VerifyPaymentCallbackResponse(paymentRecord.Status == PaymentStatus.Completed, order.Id.ToString(), null);
            }

            return new VerifyPaymentCallbackResponse(false, null, "Payment record not found or not processing.");
        }

        var verifyRequest = new PaymentVerifyRequest(
            OrderId: order.Id.ToString(),
            ProviderReference: cmd.ProviderReference ?? string.Empty,
            RawPayload: "", // No raw payload for callback (usually form or query)
            Headers: cmd.Headers.ToDictionary(k => k.Key, v => v.Value));

        var verifyResult = await provider.VerifyPaymentAsync(verifyRequest, ct);

        if (verifyResult.IsSuccess)
        {
            paymentRecord.MarkCompleted(verifyResult.TransactionId ?? cmd.ProviderReference ?? "unknown", "Callback Verified");
            order.MarkAsPaid();
            _logger.LogInformation("Payment.Callback.Verified. OrderId={OrderId}, Provider={Provider}", order.Id, cmd.ProviderName);
        }
        else
        {
            paymentRecord.MarkFailed(verifyResult.ErrorMessage ?? "Callback failure", "Callback failed");
            _logger.LogWarning("Payment.Callback.Failed. OrderId={OrderId}, Error={Error}", order.Id, verifyResult.ErrorMessage);
        }

        await _payments.SaveChangesAsync(ct);
        return new VerifyPaymentCallbackResponse(verifyResult.IsSuccess, order.Id.ToString(), verifyResult.ErrorMessage);
    }
}
