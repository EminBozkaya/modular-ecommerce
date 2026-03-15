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
            .WithOne(i => i.Basket)
            .HasForeignKey(i => i.BasketId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // EF Core must use the private backing field _items for collection navigation
        builder.Navigation(b => b.Items).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
{
    public void Configure(EntityTypeBuilder<BasketItem> builder)
    {
        builder.ToTable("BasketItems");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.ProductName).IsRequired().HasMaxLength(200);

        builder.Property(i => i.Quantity)
            .HasPrecision(18, 3);

        builder.OwnsOne(i => i.UnitPriceSnapshot, money =>
        {
            money.Property(m => m.Amount).HasColumnName("UnitPrice_Amount").HasPrecision(18, 2);
            money.Property(m => m.Currency).HasColumnName("UnitPrice_Currency").HasMaxLength(3).HasConversion<string>();
        });
    }
}
