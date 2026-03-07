using ECommerce.Domain.Basket;
using ECommerce.Domain.Basket.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class BasketRepository : IBasketRepository
{
    private readonly ApplicationDbContext _ctx;

    public BasketRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<Basket?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _ctx.Baskets.Include(b => b.Items)
            .FirstOrDefaultAsync(b => b.UserId == userId, ct);

    public async Task<Basket?> GetBySessionIdAsync(string sessionId, CancellationToken ct = default)
        => await _ctx.Baskets.Include(b => b.Items)
            .FirstOrDefaultAsync(b => b.SessionId == sessionId, ct);

    public async Task AddAsync(Basket basket, CancellationToken ct = default)
        => await _ctx.Baskets.AddAsync(basket, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
