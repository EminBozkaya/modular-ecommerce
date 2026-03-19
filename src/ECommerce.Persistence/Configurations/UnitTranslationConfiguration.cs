using ECommerce.Domain.Catalog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class UnitTranslationConfiguration : IEntityTypeConfiguration<UnitTranslation>
{
    public void Configure(EntityTypeBuilder<UnitTranslation> builder)
    {
        builder.ToTable("UnitTranslations");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.LanguageCode)
            .IsRequired()
            .HasMaxLength(5);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(t => t.Unit)
            .WithMany(u => u.Translations)
            .HasForeignKey(t => t.UnitId)
            .OnDelete(DeleteBehavior.Cascade);

        // Each unit can have at most one translation per language
        builder.HasIndex(t => new { t.UnitId, t.LanguageCode })
            .IsUnique()
            .HasFilter("\"IsDeleted\" = false");
    }
}
