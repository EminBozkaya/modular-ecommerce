using ECommerce.Domain.Basket.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class BasketConfiguration : IEntityTypeConfiguration<Domain.Basket.Entities.Basket>
{
    public void Configure(EntityTypeBuilder<Domain.Basket.Entities.Basket> builder)
    {
        builder.ToTable("Baskets");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.SessionId).HasMaxLength(128);

        builder.HasMany(b => b.Items)
            .WithOne()
            .HasForeignKey("BasketId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
{
    public void Configure(EntityTypeBuilder<BasketItem> builder)
    {
        builder.ToTable("BasketItems");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.ProductName).IsRequired().HasMaxLength(200);

        builder.OwnsOne(i => i.UnitPriceSnapshot, money =>
        {
            money.Property(m => m.Amount).HasColumnName("UnitPrice_Amount").HasPrecision(18, 2);
            money.Property(m => m.Currency).HasColumnName("UnitPrice_Currency").HasMaxLength(3);
        });
    }
}
