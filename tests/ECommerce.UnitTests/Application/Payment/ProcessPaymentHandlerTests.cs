using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Payment.Commands;
using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Entities;
using FluentAssertions;
using NSubstitute;
using ECommerce.Domain.Catalog.ValueObjects;

namespace ECommerce.UnitTests.Application.Payment;

public class ProcessPaymentHandlerTests
{
    private readonly IOrderRepository _orders;
    private readonly IPaymentRepository _payments;
    private readonly IPaymentService _paymentService;
    private readonly ProcessPaymentHandler _handler;

    public ProcessPaymentHandlerTests()
    {
        _orders = Substitute.For<IOrderRepository>();
        _payments = Substitute.For<IPaymentRepository>();
        _paymentService = Substitute.For<IPaymentService>();
        _handler = new ProcessPaymentHandler(_orders, _payments, _paymentService);
    }

    [Fact]
    public async Task Handle_IdempotencyKeyExists_ReturnsExistingId()
    {
        // Arrange
        var existingId = Guid.NewGuid();
        var existingRecord = PaymentRecord.CreatePending(Guid.NewGuid(), new Money(100, "USD"), "Provider", "key");
        var idProp = typeof(ECommerce.Domain.Common.BaseEntity).GetProperty("Id");
        if (idProp is not null) idProp.SetValue(existingRecord, existingId);

        _payments.GetByIdempotencyKeyAsync(Arg.Any<Guid>(), "existing_key", Arg.Any<CancellationToken>())
            .Returns(existingRecord);

        var cmd = new ProcessPaymentCommand(Guid.NewGuid(), "token", "existing_key");

        // Act
        var resultId = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        resultId.Should().Be(existingId);
        await _payments.DidNotReceive().AddAsync(Arg.Any<PaymentRecord>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_NewPayment_ChargesAndSaves()
    {
        // Arrange
        _payments.GetByIdempotencyKeyAsync(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((PaymentRecord?)null);

        var order = Order.Create(Guid.NewGuid(), "test@user.com", "addr", [
            ECommerce.Domain.Ordering.Entities.OrderItem.Create(Guid.NewGuid(), "P1", new Money(100, "USD"), 1)
        ]);

        _orders.GetByIdWithItemsAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(order);

        _paymentService.ChargeAsync(Arg.Any<Order>(), "token", Arg.Any<CancellationToken>())
            .Returns(Task.FromResult("tx-id"));

        var cmd = new ProcessPaymentCommand(order.Id, "token", "new_key");

        // Act
        var resultId = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        order.Status.Should().Be(ECommerce.Domain.Ordering.Enums.OrderStatus.Paid);
        await _payments.Received(1).AddAsync(Arg.Any<PaymentRecord>(), Arg.Any<CancellationToken>());
        await _payments.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
