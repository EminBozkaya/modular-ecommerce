using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ECommerce.Application.Payment.RefundPayment;

public class RefundPaymentHandler : IRequestHandler<RefundPaymentCommand, RefundPaymentResponse>
{
    private readonly IPaymentRepository _payments;
    private readonly IEnumerable<IPaymentProvider> _providers;
    private readonly ILogger<RefundPaymentHandler> _logger;

    public RefundPaymentHandler(
        IPaymentRepository payments,
        IEnumerable<IPaymentProvider> providers,
        ILogger<RefundPaymentHandler> logger)
    {
        _payments = payments;
        _providers = providers;
        _logger = logger;
    }

    public async Task<RefundPaymentResponse> Handle(
        RefundPaymentCommand cmd, CancellationToken ct)
    {
        // Find completed PaymentRecord
        var paymentRecord = await _payments.GetByOrderIdAndStatusAsync(
            cmd.OrderId, PaymentStatus.Completed, ct);

        if (paymentRecord is null)
            throw new InvalidOperationException($"No completed payment found for order '{cmd.OrderId}'.");

        if (paymentRecord.ProviderTransactionId is null)
            throw new InvalidOperationException("Payment has no transaction ID — cannot refund.");

        // Provider lookup
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(paymentRecord.ProviderName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            throw new InvalidOperationException($"Provider '{paymentRecord.ProviderName}' not found.");

        // Build refund amount
        Money? refundAmount = cmd.Amount.HasValue
            ? new Money(cmd.Amount.Value, paymentRecord.Amount.Currency)
            : null;

        var refundRequest = new RefundRequest(
            OrderId: cmd.OrderId.ToString(),
            TransactionId: paymentRecord.ProviderTransactionId,
            Amount: refundAmount);

        _logger.LogInformation(
            "Payment.Refund.Started. OrderId={OrderId}, Provider={Provider}, Amount={Amount}",
            cmd.OrderId, paymentRecord.ProviderName, cmd.Amount?.ToString() ?? "full");

        var result = await provider.RefundAsync(refundRequest, ct);

        if (result.IsSuccess)
        {
            paymentRecord.MarkRefunded(result.RefundId ?? "refunded");
            await _payments.SaveChangesAsync(ct);

            _logger.LogInformation(
                "Payment.Refund.Success. OrderId={OrderId}, Provider={Provider}, RefundId={RefundId}",
                cmd.OrderId, paymentRecord.ProviderName, result.RefundId);

            return new RefundPaymentResponse(true, result.RefundId, null);
        }

        _logger.LogWarning(
            "Payment.Refund.Failed. OrderId={OrderId}, Provider={Provider}, ErrorCode={Code}",
            cmd.OrderId, paymentRecord.ProviderName, result.ErrorCode);

        return new RefundPaymentResponse(false, null, result.ErrorMessage);
    }
}
