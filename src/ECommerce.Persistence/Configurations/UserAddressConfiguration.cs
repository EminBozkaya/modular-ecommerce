using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(EntityTypeBuilder<UserAddress> builder)
    {
        builder.ToTable("UserAddresses");
        builder.HasKey(a => a.Id);

        // ── Existing columns (must remain unchanged) ──
        builder.Property(a => a.Title).IsRequired().HasMaxLength(100);
        builder.Property(a => a.FullName).IsRequired().HasMaxLength(200);
        builder.Property(a => a.AddressLine1).IsRequired().HasMaxLength(500);
        builder.Property(a => a.AddressLine2).HasMaxLength(500);
        builder.Property(a => a.City).IsRequired().HasMaxLength(100);
        builder.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Country).IsRequired().HasMaxLength(100);

        builder.HasIndex(a => a.UserId);

        // ── New relational FK columns (nullable) ──
        builder.Property(a => a.CountryId).IsRequired(false);
        builder.Property(a => a.CityId).IsRequired(false);
        builder.Property(a => a.DistrictId).IsRequired(false);

        // Indexes for FK columns
        builder.HasIndex(a => a.CountryId);
        builder.HasIndex(a => a.CityId);
        builder.HasIndex(a => a.DistrictId);

        // ── Relationships ──
        builder.HasOne(a => a.CountryRef)
            .WithMany()
            .HasForeignKey(a => a.CountryId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.CityRef)
            .WithMany()
            .HasForeignKey(a => a.CityId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.DistrictRef)
            .WithMany()
            .HasForeignKey(a => a.DistrictId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
