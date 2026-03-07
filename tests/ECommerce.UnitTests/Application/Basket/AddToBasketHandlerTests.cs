using ECommerce.Application.Basket.Commands;
using ECommerce.Domain.Basket;
using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using FluentAssertions;
using NSubstitute;

namespace ECommerce.UnitTests.Application.Basket;

public class AddToBasketHandlerTests
{
    private readonly IBasketRepository _basketRepo;
    private readonly IProductRepository _productRepo;
    private readonly AddToBasketHandler _handler;

    public AddToBasketHandlerTests()
    {
        _basketRepo = Substitute.For<IBasketRepository>();
        _productRepo = Substitute.For<IProductRepository>();
        _handler = new AddToBasketHandler(_basketRepo, _productRepo);
    }

    [Fact]
    public async Task Handle_ProductNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        _productRepo.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Product?)null);
        var cmd = new AddToBasketCommand(null, "session-1", Guid.NewGuid(), 1);

        // Act
        Func<Task> act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("Product not found.");
    }

    [Fact]
    public async Task Handle_NewGuestBasket_CreatesBasketAndAddsItem()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = Product.Create("Test Product", null, null, new Money(100, "USD"), new StockQuantity(10), Guid.NewGuid());
        var idProp = typeof(ECommerce.Domain.Common.BaseEntity).GetProperty("Id");
        if (idProp != null) idProp.SetValue(product, productId);

        _productRepo.GetByIdAsync(productId, Arg.Any<CancellationToken>())
            .Returns(product);
        
        _basketRepo.GetBySessionIdAsync("session-1", Arg.Any<CancellationToken>())
            .Returns((ECommerce.Domain.Basket.Entities.Basket?)null);

        var cmd = new AddToBasketCommand(null, "session-1", productId, 2);

        // Act
        await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await _basketRepo.Received(1).AddAsync(Arg.Any<ECommerce.Domain.Basket.Entities.Basket>(), Arg.Any<CancellationToken>());
        await _basketRepo.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ExistingUserBasket_AddsItemToBasket()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        var basket = ECommerce.Domain.Basket.Entities.Basket.CreateForUser(userId);
        
        var product = Product.Create("Test Product", null, null, new Money(100, "USD"), new StockQuantity(10), Guid.NewGuid());
        var idProp = typeof(ECommerce.Domain.Common.BaseEntity).GetProperty("Id");
        if (idProp != null) idProp.SetValue(product, productId);

        _productRepo.GetByIdAsync(productId, Arg.Any<CancellationToken>())
            .Returns(product);
        
        _basketRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
            .Returns(basket);

        var cmd = new AddToBasketCommand(userId, null, productId, 1);

        // Act
        await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        basket.Items.Should().HaveCount(1);
        basket.Items.First().ProductId.Should().Be(productId);
        await _basketRepo.DidNotReceive().AddAsync(Arg.Any<ECommerce.Domain.Basket.Entities.Basket>(), Arg.Any<CancellationToken>());
        await _basketRepo.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
