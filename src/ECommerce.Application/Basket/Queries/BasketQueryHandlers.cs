using ECommerce.Application.Catalog.Queries;
using ECommerce.Application.Common.Settings;
using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using MediatR;
using Microsoft.Extensions.Options;

namespace ECommerce.Application.Basket.Queries;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, BasketDto?>
{
    private readonly IBasketRepository _baskets;
    private readonly IProductRepository _products;
    private readonly string _defaultLanguage;

    public GetBasketHandler(IBasketRepository baskets, IProductRepository products, IOptions<LocalizationOptions> locOptions)
    {
        _baskets = baskets;
        _products = products;
        _defaultLanguage = locOptions.Value.DefaultLanguage;
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
            // GetByIdAsNoTrackingAsync includes Unit.Translations via ThenInclude
            var product = await _products.GetByIdAsNoTrackingAsync(i.ProductId, ct);
            itemDtos.Add(new BasketItemDto(
                i.ProductId,
                i.ProductName,
                i.UnitPriceSnapshot.Amount,
                i.UnitPriceSnapshot.Currency.ToString(),
                i.Quantity,
                i.LineTotalSnapshot.Amount,
                product?.ImageUrl,
                UnitNameResolver.Resolve(product?.Unit, q.Language, _defaultLanguage),
                product?.Unit?.Code,
                product?.Stock.Value ?? 0));
        }

        return new BasketDto(basket.Id, itemDtos, basket.Total.Amount, basket.Total.Currency.ToString());
    }
}
