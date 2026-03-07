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
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal);

public record GetBasketQuery(Guid? UserId, string? SessionId) : IRequest<BasketDto?>;
