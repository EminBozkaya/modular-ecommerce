using ECommerce.Domain.Payment.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class PaymentProviderLogConfiguration : IEntityTypeConfiguration<PaymentProviderLog>
{
    public void Configure(EntityTypeBuilder<PaymentProviderLog> builder)
    {
        builder.ToTable("PaymentProviderLogs");
        builder.HasKey(l => l.Id);

        builder.Property(l => l.ProviderName).IsRequired().HasMaxLength(50);
        builder.Property(l => l.Action).IsRequired().HasMaxLength(50);
        builder.Property(l => l.SanitizedRequest).HasColumnType("text");
        builder.Property(l => l.SanitizedResponse).HasColumnType("text");
        builder.Property(l => l.ErrorCode).HasMaxLength(100);

        builder.HasIndex(l => l.PaymentRecordId);
        builder.HasIndex(l => l.CreatedAt);
    }
}
