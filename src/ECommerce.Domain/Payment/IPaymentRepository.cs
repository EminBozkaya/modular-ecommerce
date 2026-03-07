using ECommerce.Domain.Payment.Entities;

namespace ECommerce.Domain.Payment;

/// <summary>
/// Aggregate repository for the PaymentRecord aggregate root.
/// </summary>
public interface IPaymentRepository
{
    Task<PaymentRecord?> GetByIdempotencyKeyAsync(Guid orderId, string idempotencyKey, CancellationToken ct = default);
    Task AddAsync(PaymentRecord payment, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
