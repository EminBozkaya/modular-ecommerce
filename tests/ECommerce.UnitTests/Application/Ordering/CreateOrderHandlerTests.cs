using ECommerce.Application.Ordering.Commands;
using ECommerce.Domain.Basket;
using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Entities;
using FluentAssertions;
using NSubstitute;

namespace ECommerce.UnitTests.Application.Ordering;

public class CreateOrderHandlerTests
{
    private readonly IBasketRepository _basketRepo;
    private readonly IProductRepository _productRepo;
    private readonly IOrderRepository _orderRepo;
    private readonly CreateOrderHandler _handler;

    public CreateOrderHandlerTests()
    {
        _basketRepo = Substitute.For<IBasketRepository>();
        _productRepo = Substitute.For<IProductRepository>();
        _orderRepo = Substitute.For<IOrderRepository>();
        _handler = new CreateOrderHandler(_orderRepo, _basketRepo, _productRepo);
    }

    [Fact]
    public async Task Handle_BasketNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        _basketRepo.GetBySessionIdAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((ECommerce.Domain.Basket.Entities.Basket?)null);
        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        // Act
        Func<Task> act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Basket is empty.");
    }

    [Fact]
    public async Task Handle_PriceChanged_ThrowsInvalidOperationException()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, "USD"), 1); // Snapshot at 100

        var product = Product.Create("P1", null, null, new Money(150, "USD"), new StockQuantity(10), Guid.NewGuid()); // Current price is 150

        _basketRepo.GetBySessionIdAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(basket);
        _productRepo.GetByIdAsync(productId, Arg.Any<CancellationToken>())
            .Returns(product);

        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        // Act
        Func<Task> act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("One or more item prices have changed*");
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesOrderAndClearsBasket()
    {
        // Arrange
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, "USD"), 2);

        var product = Product.Create("P1", null, null, new Money(100, "USD"), new StockQuantity(10), Guid.NewGuid());
        var categoryProp = typeof(Product).GetProperty(nameof(Product.Id));
        if (categoryProp != null && categoryProp.CanWrite)
            categoryProp.SetValue(product, productId); // Hack for test since Id is base entity protected set, but Mock normally handles it. We can just use reflection or assume NSubstitute returns it.
        // Actually, NSubstitute could easily mock the repo to return the product without matching IDs precisely if we just Arg.Any.
        
        _basketRepo.GetBySessionIdAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(basket);
        _productRepo.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(product);

        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        // Act
        var orderId = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        orderId.Should().NotBeEmpty();
        await _orderRepo.Received(1).AddAsync(Arg.Any<Order>(), Arg.Any<CancellationToken>());
        basket.Items.Should().BeEmpty(); // Validates Clear() was called on basket
        await _orderRepo.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
