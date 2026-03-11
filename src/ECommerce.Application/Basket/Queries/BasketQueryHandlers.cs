using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using MediatR;

namespace ECommerce.Application.Basket.Queries;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, BasketDto?>
{
    private readonly IBasketRepository _baskets;
    private readonly IProductRepository _products;

    public GetBasketHandler(IBasketRepository baskets, IProductRepository products)
    {
        _baskets = baskets;
        _products = products;
    }

    public async Task<BasketDto?> Handle(GetBasketQuery q, CancellationToken ct)
    {
        var basket = q.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(q.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(q.SessionId!, ct);
        if (basket is null) return null;

        var itemDtos = new List<BasketItemDto>();
        foreach (var i in basket.Items)
        {
            var product = await _products.GetByIdAsync(i.ProductId, ct);
            itemDtos.Add(new BasketItemDto(
                i.ProductId,
                i.ProductName,
                i.UnitPriceSnapshot.Amount,
                i.UnitPriceSnapshot.Currency.ToString(),
                i.Quantity,
                i.LineTotalSnapshot.Amount,
                product?.ImageUrl,
                product?.Unit?.Name));
        }

        return new BasketDto(basket.Id, itemDtos, basket.Total.Amount, basket.Total.Currency.ToString());
    }
}
