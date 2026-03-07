using ECommerce.Domain.Catalog.ValueObjects;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Catalog;

public class MoneyTests
{
    [Fact]
    public void Constructor_WithNegativeAmount_ThrowsArgumentException()
    {
        // Act
        Action act = () => new Money(-10, "USD");

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Amount cannot be negative.*");
    }

    [Fact]
    public void Add_WithSameCurrency_ReturnsSum()
    {
        // Arrange
        var money1 = new Money(100, "USD");
        var money2 = new Money(50, "USD");

        // Act
        var result = money1.Add(money2);

        // Assert
        result.Amount.Should().Be(150);
        result.Currency.Should().Be("USD");
    }

    [Fact]
    public void Add_WithDifferentCurrency_ThrowsInvalidOperationException()
    {
        // Arrange
        var money1 = new Money(100, "USD");
        var money2 = new Money(50, "EUR");

        // Act
        Action act = () => money1.Add(money2);

        // Assert
        act.Should().Throw<InvalidOperationException>().WithMessage("Cannot add different currencies.");
    }

    [Fact]
    public void Multiply_ReturnsMultipliedAmount()
    {
        // Arrange
        var money = new Money(100, "USD");

        // Act
        var result = money.Multiply(3);

        // Assert
        result.Amount.Should().Be(300);
        result.Currency.Should().Be("USD");
    }
}
