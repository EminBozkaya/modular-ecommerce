using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Catalog;

public class ProductTests
{
    private readonly Guid _categoryId = Guid.NewGuid();
    private readonly Money _price = new(100, "USD");
    private readonly StockQuantity _stock = new(50);

    [Fact]
    public void Create_WithValidData_ReturnsActiveProduct()
    {
        // Act
        var product = Product.Create("Test Product", "Description", "url", _price, _stock, _categoryId);

        // Assert
        product.Name.Should().Be("Test Product");
        product.IsActive.Should().BeTrue();
        product.Price.Amount.Should().Be(100);
        product.Stock.Value.Should().Be(50);
        product.CategoryId.Should().Be(_categoryId);
    }

    [Fact]
    public void Create_WithEmptyName_ThrowsArgumentException()
    {
        // Act
        Action act = () => Product.Create("", "Desc", null, _price, _stock, _categoryId);

        // Assert
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void DecreaseStock_DecreasesStockAmount()
    {
        // Arrange
        var product = Product.Create("P1", null, null, _price, new StockQuantity(10), _categoryId);

        // Act
        product.DecreaseStock(3);

        // Assert
        product.Stock.Value.Should().Be(7);
    }

    [Fact]
    public void Deactivate_SetsIsActiveToFalse()
    {
        // Arrange
        var product = Product.Create("P1", null, null, _price, _stock, _categoryId);

        // Act
        product.Deactivate();

        // Assert
        product.IsActive.Should().BeFalse();
    }
}
