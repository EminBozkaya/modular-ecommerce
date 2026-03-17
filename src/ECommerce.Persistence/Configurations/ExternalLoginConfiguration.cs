using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class ExternalLoginConfiguration : IEntityTypeConfiguration<ExternalLogin>
{
    public void Configure(EntityTypeBuilder<ExternalLogin> builder)
    {
        builder.ToTable("ExternalLogins");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Provider).IsRequired().HasMaxLength(50);
        builder.Property(e => e.ProviderUserId).IsRequired().HasMaxLength(250);

        // Composite unique index ensures a platform's user ID is only linked once
        builder.HasIndex(e => new { e.Provider, e.ProviderUserId }).IsUnique();

        builder.HasOne(e => e.User)
            .WithMany(u => u.ExternalLogins)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
