using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class UserBillingAddressConfiguration : IEntityTypeConfiguration<UserBillingAddress>
{
    public void Configure(EntityTypeBuilder<UserBillingAddress> builder)
    {
        builder.ToTable("UserBillingAddresses");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title).IsRequired().HasMaxLength(100);
        builder.Property(a => a.InvoiceType).IsRequired();

        // Individual
        builder.Property(a => a.FullName).HasMaxLength(100);
        builder.Property(a => a.TcKimlikNo).HasMaxLength(11);

        // Corporate
        builder.Property(a => a.CompanyName).HasMaxLength(200);
        builder.Property(a => a.TaxOffice).HasMaxLength(100);
        builder.Property(a => a.TaxNumber).HasMaxLength(10);

        // Common address
        builder.Property(a => a.AddressLine1).IsRequired().HasMaxLength(200);
        builder.Property(a => a.AddressLine2).HasMaxLength(200);
        builder.Property(a => a.City).IsRequired().HasMaxLength(100);
        builder.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Country).IsRequired().HasMaxLength(100);

        builder.HasIndex(a => a.UserId);

        // Relational FK columns (nullable)
        builder.Property(a => a.CountryId).IsRequired(false);
        builder.Property(a => a.CityId).IsRequired(false);
        builder.Property(a => a.DistrictId).IsRequired(false);

        builder.HasIndex(a => a.CountryId);
        builder.HasIndex(a => a.CityId);
        builder.HasIndex(a => a.DistrictId);

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

        // Soft delete query filter
        builder.HasQueryFilter(a => !a.IsDeleted);
    }
}
