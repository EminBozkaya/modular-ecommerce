using ECommerce.Domain.Catalog.ValueObjects;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Catalog;

public class StockQuantityTests
{
    [Fact]
    public void Constructor_WithNegativeAmount_ThrowsArgumentException()
    {
        // Act
        Action act = () => new StockQuantity(-5);

        // Assert
        act.Should().Throw<ArgumentException>().WithMessage("Stock cannot be negative.*");
    }

    [Theory]
    [InlineData(0, false)]
    [InlineData(1, true)]
    [InlineData(10, true)]
    public void IsAvailable_ReturnsExpectedResult(int amount, bool expected)
    {
        // Arrange
        var stock = new StockQuantity(amount);

        // Act
        var isAvailable = stock.IsAvailable;

        // Assert
        isAvailable.Should().Be(expected);
    }

    [Fact]
    public void Decrease_WithValidAmount_ReturnsDecreasedStock()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act
        var result = stock.Decrease(3);

        // Assert
        result.Value.Should().Be(7);
    }

    [Fact]
    public void Decrease_WithAmountGreaterThanCurrent_ThrowsInvalidOperationException()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act
        Action act = () => stock.Decrease(15);

        // Assert
        act.Should().Throw<InvalidOperationException>().WithMessage("Insufficient stock.");
    }

    [Fact]
    public void Increase_ReturnsIncreasedStock()
    {
        // Arrange
        var stock = new StockQuantity(10);

        // Act
        var result = stock.Increase(5);

        // Assert
        result.Value.Should().Be(15);
    }
}
