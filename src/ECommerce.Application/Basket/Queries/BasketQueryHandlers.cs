using ECommerce.Domain.Basket;
using MediatR;

namespace ECommerce.Application.Basket.Queries;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, BasketDto?>
{
    private readonly IBasketRepository _baskets;
    public GetBasketHandler(IBasketRepository baskets) => _baskets = baskets;

    public async Task<BasketDto?> Handle(GetBasketQuery q, CancellationToken ct)
    {
        var basket = q.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(q.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(q.SessionId!, ct);
        if (basket is null) return null;
        return new BasketDto(basket.Id,
            basket.Items.Select(i => new BasketItemDto(i.ProductId, i.ProductName,
                i.UnitPriceSnapshot.Amount, i.Quantity, i.LineTotalSnapshot.Amount)).ToList(),
            basket.Total.Amount, basket.Total.Currency);
    }
}
