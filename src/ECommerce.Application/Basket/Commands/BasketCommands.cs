using ECommerce.Application.Basket.Queries;
using MediatR;

namespace ECommerce.Application.Basket.Commands;

public record AddToBasketCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId,
    decimal Quantity) : IRequest<BasketDto>;

public record RemoveFromBasketCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId) : IRequest<BasketDto>;

public record ClearBasketCommand(
    Guid? UserId,
    string? SessionId) : IRequest;

public record UpdateBasketItemCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId,
    decimal Quantity) : IRequest<BasketDto>;
