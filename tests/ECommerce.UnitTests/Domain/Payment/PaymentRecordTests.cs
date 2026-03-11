using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Payment.Enums;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Payment;

public class PaymentRecordTests
{
    private readonly Guid _orderId = Guid.NewGuid();
    private readonly Money _amount = new(100, Currency.USD);
    private readonly string _provider = "Stripe";
    private readonly string _idempotencyKey = "idemp-key-123";
    private readonly TimeSpan _expiration = TimeSpan.FromMinutes(30);

    [Fact]
    public void Create_SetsInitialValuesCorrectly()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);

        record.OrderId.Should().Be(_orderId);
        record.Amount.Should().Be(_amount);
        record.ProviderName.Should().Be(_provider);
        record.IdempotencyKey.Should().Be(_idempotencyKey);
        record.Status.Should().Be(PaymentStatus.Pending);
        record.ExpiresAt.Should().NotBeNull();
        record.IsTerminal.Should().BeFalse();
    }

    [Fact]
    public void MarkProcessing_FromPending_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);

        record.MarkProcessing("prov-ref-123");

        record.Status.Should().Be(PaymentStatus.Processing);
        record.ProviderReference.Should().Be("prov-ref-123");
    }

    [Fact]
    public void MarkProcessing_FromProcessing_Throws()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");

        Action act = () => record.MarkProcessing("ref2");

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void MarkCompleted_FromProcessing_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");

        record.MarkCompleted("tx-999", "{}");

        record.Status.Should().Be(PaymentStatus.Completed);
        record.ProviderTransactionId.Should().Be("tx-999");
        record.IsTerminal.Should().BeTrue();
    }

    [Fact]
    public void MarkFailed_FromPending_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);

        record.MarkFailed("Insufficient funds");

        record.Status.Should().Be(PaymentStatus.Failed);
        record.FailureReason.Should().Be("Insufficient funds");
        record.IsTerminal.Should().BeTrue();
    }

    [Fact]
    public void MarkFailed_FromCompleted_Throws()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");
        record.MarkCompleted("tx", "{}");

        Action act = () => record.MarkFailed("reason");

        act.Should().Throw<InvalidOperationException>().WithMessage("Cannot mark Failed: already Completed");
    }

    [Fact]
    public void MarkExpired_FromProcessing_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");

        record.MarkExpired();

        record.Status.Should().Be(PaymentStatus.Expired);
        record.IsTerminal.Should().BeTrue();
    }

    [Fact]
    public void MarkCancelled_FromProcessing_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");

        record.MarkCancelled("New payment started");

        record.Status.Should().Be(PaymentStatus.Cancelled);
        record.IsTerminal.Should().BeTrue();
    }

    [Fact]
    public void MarkCancelled_FromCompleted_Throws()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");
        record.MarkCompleted("tx", "{}");

        Action act = () => record.MarkCancelled("reason");

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void MarkRefunded_FromCompleted_Succeeds()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);
        record.MarkProcessing("ref");
        record.MarkCompleted("tx", "{}");

        record.MarkRefunded("refund-id-123");

        record.Status.Should().Be(PaymentStatus.Refunded);
        record.IsTerminal.Should().BeTrue();
    }

    [Fact]
    public void MarkRefunded_FromPending_Throws()
    {
        var record = PaymentRecord.Create(_orderId, _idempotencyKey, _provider, _amount, _expiration);

        Action act = () => record.MarkRefunded("refund-id");

        act.Should().Throw<InvalidOperationException>().WithMessage("Can only refund Completed payments");
    }
}
