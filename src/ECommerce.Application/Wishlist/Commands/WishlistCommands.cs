using MediatR;

namespace ECommerce.Application.Wishlist.Commands;

public record AddToWishlistCommand(Guid UserId, Guid ProductId) : IRequest;

public record RemoveFromWishlistCommand(Guid UserId, Guid ProductId) : IRequest;

public record ClearWishlistCommand(Guid UserId) : IRequest;
