using ECommerce.Domain.Wishlist.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.ToTable("WishlistItems");
        builder.HasKey(w => w.Id);

        builder.HasIndex(w => new { w.UserId, w.ProductId })
            .IsUnique()
            .HasFilter("\"IsDeleted\" = false");

        builder.HasIndex(w => w.UserId);
    }
}
