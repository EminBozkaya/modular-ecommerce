using ECommerce.Domain.Common;

namespace ECommerce.Domain.Wishlist.Entities;

public class WishlistItem : BaseAuditableEntity
{
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }

    private WishlistItem() { }

    public static WishlistItem Create(Guid userId, Guid productId)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        if (productId == Guid.Empty) throw new ArgumentException("ProductId is required.", nameof(productId));

        return new WishlistItem
        {
            UserId = userId,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void SoftDelete()
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }
}
