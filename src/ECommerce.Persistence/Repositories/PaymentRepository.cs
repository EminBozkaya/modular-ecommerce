using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _ctx;

    public PaymentRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<PaymentRecord?> GetByIdempotencyKeyAsync(Guid orderId, string idempotencyKey, CancellationToken ct = default)
        => await _ctx.PaymentRecords
            .FirstOrDefaultAsync(p => p.OrderId == orderId && p.IdempotencyKey == idempotencyKey, ct);

    public async Task AddAsync(PaymentRecord payment, CancellationToken ct = default)
        => await _ctx.PaymentRecords.AddAsync(payment, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
