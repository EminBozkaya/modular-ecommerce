using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Payment.Entities;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Payment;

public class PaymentRecordTests
{
    private readonly Guid _orderId = Guid.NewGuid();
    private readonly Money _amount = new(100, "USD");
    private readonly string _provider = "Stripe";
    private readonly string _idempotencyKey = "idemp-key-123";

    [Fact]
    public void CreatePending_SetsInitialValuesCorrectly()
    {
        // Act
        var record = PaymentRecord.CreatePending(_orderId, _amount, _provider, _idempotencyKey);

        // Assert
        record.OrderId.Should().Be(_orderId);
        record.Amount.Should().Be(_amount);
        record.Provider.Should().Be(_provider);
        record.IdempotencyKey.Should().Be(_idempotencyKey);
        record.Status.Should().Be(PaymentStatus.Pending);
    }

    [Fact]
    public void MarkSucceeded_UpdatesStatusAndTransactionId()
    {
        // Arrange
        var record = PaymentRecord.CreatePending(_orderId, _amount, _provider, _idempotencyKey);
        var txId = "tx-999";

        // Act
        record.MarkSucceeded(txId);

        // Assert
        record.Status.Should().Be(PaymentStatus.Succeeded);
        record.ProviderTransactionId.Should().Be(txId);
    }

    [Fact]
    public void MarkFailed_UpdatesStatusAndReason()
    {
        // Arrange
        var record = PaymentRecord.CreatePending(_orderId, _amount, _provider, _idempotencyKey);
        var reason = "Insufficient funds";

        // Act
        record.MarkFailed(reason);

        // Assert
        record.Status.Should().Be(PaymentStatus.Failed);
        record.FailureReason.Should().Be(reason);
    }
}
