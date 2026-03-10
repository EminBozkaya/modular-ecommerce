using MediatR;

namespace ECommerce.Application.Basket.Queries;

public record BasketDto(
    Guid BasketId,
    IReadOnlyList<BasketItemDto> Items,
    decimal TotalAmount,
    string Currency);

public record BasketItemDto(
    Guid ProductId,
    string ProductName,
    decimal UnitPriceSnapshot,
    string Currency,
    decimal Quantity,
    decimal LineTotal,
    string? ImageUrl,
    string? UnitName);

public record GetBasketQuery(Guid? UserId, string? SessionId) : IRequest<BasketDto?>;
