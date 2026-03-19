using ECommerce.Domain.Catalog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class UnitConfiguration : IEntityTypeConfiguration<Unit>
{
    public void Configure(EntityTypeBuilder<Unit> builder)
    {
        builder.ToTable("Units");
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.Code)
            .HasMaxLength(20);

        builder.HasIndex(u => u.Name).IsUnique();
        builder.HasIndex(u => u.Code).IsUnique().HasFilter("\"Code\" IS NOT NULL");

        builder.HasMany(u => u.Translations)
            .WithOne(t => t.Unit)
            .HasForeignKey(t => t.UnitId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
