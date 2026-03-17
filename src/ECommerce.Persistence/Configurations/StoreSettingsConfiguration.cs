using ECommerce.Domain.Settings.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class StoreSettingsConfiguration : IEntityTypeConfiguration<StoreSettings>
{
    public void Configure(EntityTypeBuilder<StoreSettings> builder)
    {
        builder.ToTable("StoreSettings");
        builder.HasKey(s => s.Id);

        // Logo stored as base64 text — large but acceptable for a single-row table
        builder.Property(s => s.ImageBase64)
            .HasColumnType("text");

        // jsonb — enables GIN indexing and JSON operators on PostgreSQL
        builder.Property(s => s.Settings)
            .HasColumnType("jsonb")
            .IsRequired();
    }
}
