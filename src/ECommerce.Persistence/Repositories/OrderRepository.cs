using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _ctx;

    public OrderRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<Order?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Orders.Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IReadOnlyList<Order>> GetAllWithItemsAsync(Guid? userId, CancellationToken ct = default)
    {
        var query = _ctx.Orders.AsNoTracking().Include(o => o.Items).AsQueryable();
        if (userId.HasValue)
            query = query.Where(o => o.UserId == userId);
        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<Order> Items, int TotalCount)> GetPagedAsync(
        Guid? userId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _ctx.Orders.AsNoTracking().Include(o => o.Items).AsQueryable();
        if (userId.HasValue)
            query = query.Where(o => o.UserId == userId);
        query = query.OrderByDescending(o => o.CreatedAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task AddAsync(Order order, CancellationToken ct = default)
        => await _ctx.Orders.AddAsync(order, ct);

    public async Task<Order?> GetByIdTrackedAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Orders.Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
