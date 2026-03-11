using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _ctx;

    public PaymentRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<PaymentRecord?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.PaymentRecords.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<PaymentRecord?> GetByIdempotencyKeyAsync(Guid orderId, string idempotencyKey, CancellationToken ct = default)
        => await _ctx.PaymentRecords
            .FirstOrDefaultAsync(p => p.OrderId == orderId && p.IdempotencyKey == idempotencyKey, ct);

    public async Task<PaymentRecord?> GetByOrderIdAndStatusAsync(Guid orderId, PaymentStatus status, CancellationToken ct = default)
        => await _ctx.PaymentRecords
            .FirstOrDefaultAsync(p => p.OrderId == orderId && p.Status == status, ct);

    public async Task<PaymentRecord?> GetByProviderReferenceAsync(string providerReference, CancellationToken ct = default)
        => await _ctx.PaymentRecords
            .FirstOrDefaultAsync(p => p.ProviderReference == providerReference, ct);

    public async Task<IReadOnlyList<PaymentRecord>> GetProcessingExpiredAsync(CancellationToken ct = default)
        => await _ctx.PaymentRecords
            .Where(p => p.Status == PaymentStatus.Processing && p.ExpiresAt < DateTime.UtcNow)
            .ToListAsync(ct);

    public async Task AddAsync(PaymentRecord payment, CancellationToken ct = default)
        => await _ctx.PaymentRecords.AddAsync(payment, ct);

    public async Task AddLogAsync(PaymentProviderLog log, CancellationToken ct = default)
        => await _ctx.PaymentProviderLogs.AddAsync(log, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
