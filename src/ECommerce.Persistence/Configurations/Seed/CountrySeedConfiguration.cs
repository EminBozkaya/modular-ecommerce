using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations.Seed;

/// <summary>
/// Seeds Turkey as the default country.
/// </summary>
public class CountrySeedConfiguration : IEntityTypeConfiguration<Country>
{
    public void Configure(EntityTypeBuilder<Country> builder)
    {
        builder.HasData(new { Id = 1, Name = "Türkiye", IsoCode = "TR" });
    }
}
