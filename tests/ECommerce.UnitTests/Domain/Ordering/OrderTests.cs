using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Domain.Ordering.Enums;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Ordering;

public class OrderTests
{
    private readonly string _shippingAddress = "123 Main St, Anytown";
    private readonly List<OrderItem> _validItems =
    [
        OrderItem.Create(Guid.NewGuid(), "Product A", new Money(50, "USD"), 2) // 100 USD
    ];

    [Fact]
    public void Create_WithValidData_ReturnsPendingOrder()
    {
        // Act
        var order = Order.Create(Guid.NewGuid(), "test@user.com", _shippingAddress, _validItems);

        // Assert
        order.Status.Should().Be(OrderStatus.Pending);
        order.ShippingAddress.Should().Be(_shippingAddress);
        order.Items.Should().HaveCount(1);
        order.Total.Amount.Should().Be(100);
    }

    [Fact]
    public void Create_GuestWithoutEmail_ThrowsArgumentException()
    {
        // Act
        Action act = () => Order.Create(null, null, _shippingAddress, _validItems);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Guest orders require an email address.");
    }

    [Fact]
    public void Create_WithoutItems_ThrowsInvalidOperationException()
    {
        // Act
        Action act = () => Order.Create(Guid.NewGuid(), null, _shippingAddress, []);

        // Assert
        act.Should().Throw<InvalidOperationException>().WithMessage("An order must have at least one item.");
    }

    [Fact]
    public void MarkAsPaid_ChangesStatus()
    {
        // Arrange
        var order = Order.Create(Guid.NewGuid(), null, _shippingAddress, _validItems);

        // Act
        order.MarkAsPaid();

        // Assert
        order.Status.Should().Be(OrderStatus.Paid);
    }

    [Fact]
    public void Cancel_WhenShipped_ThrowsInvalidOperationException()
    {
        // Arrange
        var order = Order.Create(Guid.NewGuid(), null, _shippingAddress, _validItems);
        order.MarkAsShipped();

        // Act
        Action act = () => order.Cancel();

        // Assert
        act.Should().Throw<InvalidOperationException>().WithMessage("Cannot cancel a shipped or delivered order.");
    }
}
