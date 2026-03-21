using MediatR;

namespace ECommerce.Application.Wishlist.Queries;

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal Price,
    string Currency,
    string? ImageUrl,
    string CategoryName,
    decimal StockQuantity,
    bool IsActive,
    string? UnitName,
    string? UnitCode,
    DateTime AddedAt);

public record GetWishlistQuery(Guid UserId) : IRequest<IReadOnlyList<WishlistItemDto>>;

public record GetWishlistProductIdsQuery(Guid UserId) : IRequest<IReadOnlyList<Guid>>;
