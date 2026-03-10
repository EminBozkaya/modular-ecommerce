using ECommerce.Application.Basket.Queries;
using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using MediatR;

namespace ECommerce.Application.Basket.Commands;

public class AddToBasketHandler : IRequestHandler<AddToBasketCommand, BasketDto>
{
    private readonly IBasketRepository _baskets;
    private readonly IProductRepository _products;

    public AddToBasketHandler(IBasketRepository baskets, IProductRepository products)
    {
        _baskets = baskets;
        _products = products;
    }

    public async Task<BasketDto> Handle(AddToBasketCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException("Product not found.");

        if (!product.Stock.IsAvailable)
            throw new InvalidOperationException("Product is out of stock.");

        var basket = await GetOrCreateBasket(cmd.UserId, cmd.SessionId, ct);
        basket.AddItem(product.Id, product.Name, product.Price, cmd.Quantity);
        await _baskets.SaveChangesAsync(ct);

        return ToDto(basket, product.ImageUrl);
    }

    private async Task<Domain.Basket.Entities.Basket> GetOrCreateBasket(Guid? userId, string? sessionId, CancellationToken ct)
    {
        Domain.Basket.Entities.Basket? basket;
        if (userId.HasValue)
        {
            basket = await _baskets.GetByUserIdAsync(userId.Value, ct);
            if (basket is null) { basket = Domain.Basket.Entities.Basket.CreateForUser(userId.Value); await _baskets.AddAsync(basket, ct); }
        }
        else
        {
            basket = await _baskets.GetBySessionIdAsync(sessionId!, ct);
            if (basket is null) { basket = Domain.Basket.Entities.Basket.CreateForGuest(sessionId!); await _baskets.AddAsync(basket, ct); }
        }
        return basket;
    }

    // imageUrl of the just-added product is passed in; other items rely on snapshot name only
    private static BasketDto ToDto(Domain.Basket.Entities.Basket basket, string? addedProductImageUrl)
    {
        var items = basket.Items.Select(i => new BasketItemDto(
            i.ProductId,
            i.ProductName,
            i.UnitPriceSnapshot.Amount,
            i.UnitPriceSnapshot.Currency,
            i.Quantity,
            i.LineTotalSnapshot.Amount,
            null)).ToList();
        return new BasketDto(basket.Id, items, basket.Total.Amount, basket.Total.Currency);
    }
}

public class RemoveFromBasketHandler : IRequestHandler<RemoveFromBasketCommand, BasketDto>
{
    private readonly IBasketRepository _baskets;
    public RemoveFromBasketHandler(IBasketRepository baskets) => _baskets = baskets;

    public async Task<BasketDto> Handle(RemoveFromBasketCommand cmd, CancellationToken ct)
    {
        var basket = cmd.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(cmd.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(cmd.SessionId!, ct);
        if (basket is null)
            return new BasketDto(Guid.Empty, [], 0, "TRY");

        basket.RemoveItem(cmd.ProductId);
        await _baskets.SaveChangesAsync(ct);

        var items = basket.Items.Select(i => new BasketItemDto(
            i.ProductId,
            i.ProductName,
            i.UnitPriceSnapshot.Amount,
            i.UnitPriceSnapshot.Currency,
            i.Quantity,
            i.LineTotalSnapshot.Amount,
            null)).ToList();
        return new BasketDto(basket.Id, items, basket.Total.Amount, basket.Total.Currency);
    }
}

public class ClearBasketHandler : IRequestHandler<ClearBasketCommand>
{
    private readonly IBasketRepository _baskets;
    public ClearBasketHandler(IBasketRepository baskets) => _baskets = baskets;

    public async Task Handle(ClearBasketCommand cmd, CancellationToken ct)
    {
        var basket = cmd.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(cmd.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(cmd.SessionId!, ct);
        if (basket is null) return;
        basket.Clear();
        await _baskets.SaveChangesAsync(ct);
    }
}
