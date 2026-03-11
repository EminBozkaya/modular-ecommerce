using ECommerce.Application.Ordering.Commands;
using ECommerce.Domain.Basket;
using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
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
        _basketRepo.GetBySessionIdTrackedAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((ECommerce.Domain.Basket.Entities.Basket?)null);
        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        Func<Task> act = async () => await _handler.Handle(cmd, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Basket is empty.");
    }

    [Fact]
    public async Task Handle_PriceChanged_ThrowsInvalidOperationException()
    {
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 1);

        var product = Product.Create("P1", null, null, new Money(150, Currency.USD), new StockQuantity(10), Guid.NewGuid(), Guid.NewGuid());

        _basketRepo.GetBySessionIdTrackedAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(basket);
        _productRepo.GetByIdAsync(productId, Arg.Any<CancellationToken>())
            .Returns(product);

        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        Func<Task> act = async () => await _handler.Handle(cmd, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("One or more item prices have changed*");
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesOrderAndClearsBasket()
    {
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForGuest("session-1");
        var productId = Guid.NewGuid();
        basket.AddItem(productId, "Product A", new Money(100, Currency.USD), 2);

        var product = Product.Create("P1", null, null, new Money(100, Currency.USD), new StockQuantity(10), Guid.NewGuid(), Guid.NewGuid());

        _basketRepo.GetBySessionIdTrackedAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(basket);
        _productRepo.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(product);

        var cmd = new CreateOrderCommand(null, "guest@test.com", "session-1", "123 St");

        var result = await _handler.Handle(cmd, CancellationToken.None);

        result.OrderId.Should().NotBe(Guid.Empty);
        await _orderRepo.Received(1).AddAsync(Arg.Any<Order>(), Arg.Any<CancellationToken>());
        basket.Items.Should().BeEmpty();
        await _orderRepo.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
