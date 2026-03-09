using ECommerce.Domain.Wishlist;
using ECommerce.Domain.Wishlist.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly ApplicationDbContext _ctx;

    public WishlistRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<List<WishlistItem>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _ctx.WishlistItems.AsNoTracking()
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync(ct);

    public async Task<WishlistItem?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken ct = default)
        => await _ctx.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId, ct);

    public async Task<bool> ExistsAsync(Guid userId, Guid productId, CancellationToken ct = default)
        => await _ctx.WishlistItems.AnyAsync(w => w.UserId == userId && w.ProductId == productId, ct);

    public async Task<List<Guid>> GetProductIdsByUserAsync(Guid userId, CancellationToken ct = default)
        => await _ctx.WishlistItems.AsNoTracking()
            .Where(w => w.UserId == userId)
            .Select(w => w.ProductId)
            .ToListAsync(ct);

    public async Task AddAsync(WishlistItem item, CancellationToken ct = default)
        => await _ctx.WishlistItems.AddAsync(item, ct);

    public void Remove(WishlistItem item)
        => _ctx.WishlistItems.Remove(item);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
