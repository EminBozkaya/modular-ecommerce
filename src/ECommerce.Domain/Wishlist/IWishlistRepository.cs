using ECommerce.Domain.Wishlist.Entities;

namespace ECommerce.Domain.Wishlist;

public interface IWishlistRepository
{
    Task<List<WishlistItem>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<WishlistItem?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken ct = default);
    Task<bool> ExistsAsync(Guid userId, Guid productId, CancellationToken ct = default);
    Task<List<Guid>> GetProductIdsByUserAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(WishlistItem item, CancellationToken ct = default);
    void Remove(WishlistItem item);
    Task SaveChangesAsync(CancellationToken ct = default);
}
