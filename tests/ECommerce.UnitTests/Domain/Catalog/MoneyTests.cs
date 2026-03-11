using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Catalog;

public class MoneyTests
{
    [Fact]
    public void Constructor_WithNegativeAmount_ThrowsArgumentException()
    {
        // Act
        Action act = () => new Money(-10, Currency.USD);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Amount cannot be negative.*");
    }

    [Fact]
    public void Add_WithSameCurrency_ReturnsSum()
    {
        // Arrange
        var money1 = new Money(100, Currency.USD);
        var money2 = new Money(50, Currency.USD);

        // Act
        var result = money1.Add(money2);

        // Assert
        result.Amount.Should().Be(150);
        result.Currency.Should().Be(Currency.USD);
    }

    [Fact]
    public void Add_WithDifferentCurrency_ThrowsInvalidOperationException()
    {
        // Arrange
        var money1 = new Money(100, Currency.USD);
        var money2 = new Money(50, Currency.EUR);

        // Act
        Action act = () => money1.Add(money2);

        // Assert
        act.Should().Throw<InvalidOperationException>().WithMessage("Cannot add different currencies.");
    }

    [Fact]
    public void Multiply_ReturnsMultipliedAmount()
    {
        // Arrange
        var money = new Money(100, Currency.USD);

        // Act
        var result = money.Multiply(3);

        // Assert
        result.Amount.Should().Be(300);
        result.Currency.Should().Be(Currency.USD);
    }

    [Fact]
    public void ToMinorUnits_USD_ReturnsCents()
    {
        var money = new Money(10.99m, Currency.USD);
        money.ToMinorUnits().Should().Be(1099);
    }

    [Fact]
    public void ToMinorUnits_JPY_ReturnsWholeUnits()
    {
        var money = new Money(500, Currency.JPY);
        money.ToMinorUnits().Should().Be(500);
    }

    [Fact]
    public void FromMinorUnits_USD_ReturnsCorrectDecimal()
    {
        var money = Money.FromMinorUnits(1099, Currency.USD);
        money.Amount.Should().Be(10.99m);
        money.Currency.Should().Be(Currency.USD);
    }

    [Fact]
    public void FromMinorUnits_JPY_ReturnsWholeUnits()
    {
        var money = Money.FromMinorUnits(500, Currency.JPY);
        money.Amount.Should().Be(500);
        money.Currency.Should().Be(Currency.JPY);
    }
}
