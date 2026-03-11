using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Basket;

public class BasketTests
{
    [Fact]
    public void AddItem_ToEmptyBasket_AddsItemCorrectly()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();

        // Act
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 2);

        // Assert
        basket.Items.Should().HaveCount(1);
        var item = basket.Items.First();
        item.ProductId.Should().Be(productId);
        item.Quantity.Should().Be(2);
        item.UnitPriceSnapshot.Amount.Should().Be(100);
    }

    [Fact]
    public void AddItem_ExistingProduct_IncrementsQuantity()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 2);

        // Act
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 3);

        // Assert
        basket.Items.Should().HaveCount(1);
        basket.Items.First().Quantity.Should().Be(5);
    }

    [Fact]
    public void RemoveItem_RemovesProductFromBasket()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 1);

        // Act
        basket.RemoveItem(productId);

        // Assert
        basket.Items.Should().BeEmpty();
    }

    [Fact]
    public void Total_CalculatesSumOfAllItems()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        basket.AddItem(Guid.NewGuid(), "P1", new Money(100, Currency.USD), 2); // 200
        basket.AddItem(Guid.NewGuid(), "P2", new Money(50, Currency.USD), 1);  // 50

        // Act
        var total = basket.Total;

        // Assert
        total.Amount.Should().Be(250);
        total.Currency.Should().Be(Currency.USD);
    }
}
