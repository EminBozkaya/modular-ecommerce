using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class CountryConfiguration : IEntityTypeConfiguration<Country>
{
    public void Configure(EntityTypeBuilder<Country> builder)
    {
        builder.ToTable("Countries");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).UseIdentityColumn();

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.IsoCode)
            .IsRequired()
            .HasMaxLength(10);

        builder.HasIndex(c => c.IsoCode).IsUnique();

        // 1-many: Country → Cities
        builder.HasMany(c => c.Cities)
            .WithOne(ci => ci.Country)
            .HasForeignKey(ci => ci.CountryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
