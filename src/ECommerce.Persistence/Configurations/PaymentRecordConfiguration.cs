using ECommerce.Domain.Payment.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations;

public class PaymentRecordConfiguration : IEntityTypeConfiguration<PaymentRecord>
{
    public void Configure(EntityTypeBuilder<PaymentRecord> builder)
    {
        builder.ToTable("PaymentRecords");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Provider).IsRequired().HasMaxLength(50);
        builder.Property(p => p.ProviderTransactionId).HasMaxLength(200);
        builder.Property(p => p.FailureReason).HasMaxLength(500);
        builder.Property(p => p.IdempotencyKey).IsRequired().HasMaxLength(100);

        builder.OwnsOne(p => p.Amount, money =>
        {
            money.Property(m => m.Amount).HasColumnName("Amount_Value").HasPrecision(18, 2);
            money.Property(m => m.Currency).HasColumnName("Amount_Currency").HasMaxLength(3);
        });

        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => new { p.OrderId, p.IdempotencyKey }).IsUnique();
    }
}
