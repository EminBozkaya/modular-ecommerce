using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using MediatR;

namespace ECommerce.Application.Basket.Commands;

public class AddToBasketHandler : IRequestHandler<AddToBasketCommand>
{
    private readonly IBasketRepository _baskets;
    private readonly IProductRepository _products;

    public AddToBasketHandler(IBasketRepository baskets, IProductRepository products)
    {
        _baskets = baskets;
        _products = products;
    }

    public async Task Handle(AddToBasketCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException("Product not found.");

        var basket = await GetOrCreateBasket(cmd.UserId, cmd.SessionId, ct);
        basket.AddItem(product.Id, product.Name, product.Price, cmd.Quantity);
        await _baskets.SaveChangesAsync(ct);
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
}

public class RemoveFromBasketHandler : IRequestHandler<RemoveFromBasketCommand>
{
    private readonly IBasketRepository _baskets;
    public RemoveFromBasketHandler(IBasketRepository baskets) => _baskets = baskets;

    public async Task Handle(RemoveFromBasketCommand cmd, CancellationToken ct)
    {
        var basket = cmd.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(cmd.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(cmd.SessionId!, ct);
        if (basket is null) return;
        basket.RemoveItem(cmd.ProductId);
        await _baskets.SaveChangesAsync(ct);
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
