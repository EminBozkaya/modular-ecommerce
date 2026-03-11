using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;
using ECommerce.Domain.Payment.Enums;

namespace ECommerce.Domain.Payment.Entities;

public class PaymentRecord : BaseAuditableEntity
{
    public Guid OrderId { get; private set; }
    public string IdempotencyKey { get; private set; } = default!;
    public string ProviderName { get; private set; } = default!;
    public Money Amount { get; private set; } = default!;
    public PaymentStatus Status { get; private set; }
    public string? ProviderReference { get; private set; }
    public string? ProviderTransactionId { get; private set; }
    public string? CallbackPayload { get; private set; }
    public string? FailureReason { get; private set; }
    public DateTime? ExpiresAt { get; private set; }

    private PaymentRecord() { }

    public static PaymentRecord Create(
        Guid orderId,
        string idempotencyKey,
        string providerName,
        Money amount,
        TimeSpan expirationWindow)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(idempotencyKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(providerName);
        return new PaymentRecord
        {
            OrderId = orderId,
            IdempotencyKey = idempotencyKey,
            ProviderName = providerName,
            Amount = amount,
            Status = PaymentStatus.Pending,
            ExpiresAt = DateTime.UtcNow.Add(expirationWindow),
            CreatedAt = DateTime.UtcNow
        };
    }

    public void MarkProcessing(string providerReference)
    {
        if (Status != PaymentStatus.Pending)
            throw new InvalidOperationException($"Cannot mark Processing from {Status}");
        Status = PaymentStatus.Processing;
        ProviderReference = providerReference;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkCompleted(string transactionId, string callbackPayload)
    {
        if (Status is not (PaymentStatus.Processing or PaymentStatus.Pending))
            throw new InvalidOperationException($"Cannot mark Completed from {Status}");
        Status = PaymentStatus.Completed;
        ProviderTransactionId = transactionId;
        CallbackPayload = callbackPayload;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkFailed(string reason, string? callbackPayload = null)
    {
        if (Status == PaymentStatus.Completed)
            throw new InvalidOperationException("Cannot mark Failed: already Completed");
        Status = PaymentStatus.Failed;
        FailureReason = reason;
        CallbackPayload = callbackPayload;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkExpired()
    {
        if (Status != PaymentStatus.Processing)
            throw new InvalidOperationException($"Cannot expire from {Status}");
        Status = PaymentStatus.Expired;
        FailureReason = "Payment expired — 3D Secure timeout";
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkCancelled(string reason)
    {
        if (Status is PaymentStatus.Completed or PaymentStatus.Refunded)
            throw new InvalidOperationException($"Cannot cancel from {Status}");
        Status = PaymentStatus.Cancelled;
        FailureReason = reason;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkRefunded(string refundId)
    {
        if (Status != PaymentStatus.Completed)
            throw new InvalidOperationException("Can only refund Completed payments");
        Status = PaymentStatus.Refunded;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsTerminal => Status is PaymentStatus.Completed
        or PaymentStatus.Failed or PaymentStatus.Expired
        or PaymentStatus.Cancelled or PaymentStatus.Refunded;
}
