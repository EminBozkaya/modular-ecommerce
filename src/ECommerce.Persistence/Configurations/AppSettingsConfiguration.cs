using ECommerce.Domain.Settings.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class AppSettingsConfiguration : IEntityTypeConfiguration<AppSettings>
{
    public void Configure(EntityTypeBuilder<AppSettings> builder)
    {
        builder.ToTable("AppSettings");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Category)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(s => s.Category).IsUnique();

        builder.Property(s => s.Settings)
            .HasColumnType("jsonb")
            .IsRequired();
    }
}
