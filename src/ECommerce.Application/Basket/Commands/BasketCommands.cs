using MediatR;

namespace ECommerce.Application.Basket.Commands;

public record AddToBasketCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId,
    int Quantity) : IRequest;

public record RemoveFromBasketCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId) : IRequest;

public record ClearBasketCommand(
    Guid? UserId,
    string? SessionId) : IRequest;
