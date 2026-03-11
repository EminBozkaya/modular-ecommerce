using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Payment.Enums;

namespace ECommerce.Domain.Payment;

/// <summary>
/// Aggregate repository for the PaymentRecord aggregate root.
/// </summary>
public interface IPaymentRepository
{
    Task<PaymentRecord?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PaymentRecord?> GetByIdempotencyKeyAsync(Guid orderId, string idempotencyKey, CancellationToken ct = default);
    Task<PaymentRecord?> GetByOrderIdAndStatusAsync(Guid orderId, PaymentStatus status, CancellationToken ct = default);
    Task<PaymentRecord?> GetByProviderReferenceAsync(string providerReference, CancellationToken ct = default);
    Task<IReadOnlyList<PaymentRecord>> GetProcessingExpiredAsync(CancellationToken ct = default);
    Task AddAsync(PaymentRecord payment, CancellationToken ct = default);
    Task AddLogAsync(PaymentProviderLog log, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
