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
    int Quantity,
    decimal LineTotal,
    string? ImageUrl);

public record GetBasketQuery(Guid? UserId, string? SessionId) : IRequest<BasketDto?>;
