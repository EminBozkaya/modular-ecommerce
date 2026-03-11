using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Payment.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class PaymentRecordConfiguration : IEntityTypeConfiguration<PaymentRecord>
{
    public void Configure(EntityTypeBuilder<PaymentRecord> builder)
    {
        builder.ToTable("PaymentRecords");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.ProviderName).IsRequired().HasMaxLength(50);
        builder.Property(p => p.IdempotencyKey).IsRequired().HasMaxLength(100);
        builder.Property(p => p.ProviderReference).HasMaxLength(500);
        builder.Property(p => p.ProviderTransactionId).HasMaxLength(500);
        builder.Property(p => p.CallbackPayload).HasColumnType("text");
        builder.Property(p => p.FailureReason).HasMaxLength(1000);
        builder.Property(p => p.ExpiresAt);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.OwnsOne(p => p.Amount, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("Amount_Value")
                .HasPrecision(18, 2)
                .IsRequired();

            money.Property(m => m.Currency)
                .HasColumnName("Amount_Currency")
                .HasMaxLength(3)
                .HasConversion<string>()
                .IsRequired();
        });

        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => new { p.OrderId, p.IdempotencyKey }).IsUnique();
        builder.HasIndex(p => p.ProviderReference);

        // Background job performansı için partial index
        builder.HasIndex(p => new { p.Status, p.ExpiresAt })
            .HasFilter("\"Status\" = 'Processing'")
            .HasDatabaseName("IX_PaymentRecords_Processing_ExpiresAt");
    }
}
