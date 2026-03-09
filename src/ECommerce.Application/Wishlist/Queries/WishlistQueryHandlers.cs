using ECommerce.Domain.Catalog;
using ECommerce.Domain.Wishlist;
using MediatR;

namespace ECommerce.Application.Wishlist.Queries;

public class GetWishlistHandler : IRequestHandler<GetWishlistQuery, IReadOnlyList<WishlistItemDto>>
{
    private readonly IWishlistRepository _wishlist;
    private readonly IProductRepository _products;

    public GetWishlistHandler(IWishlistRepository wishlist, IProductRepository products)
    {
        _wishlist = wishlist;
        _products = products;
    }

    public async Task<IReadOnlyList<WishlistItemDto>> Handle(GetWishlistQuery q, CancellationToken ct)
    {
        var items = await _wishlist.GetByUserIdAsync(q.UserId, ct);
        if (items.Count == 0) return [];

        var result = new List<WishlistItemDto>();
        foreach (var item in items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct);
            if (product is null) continue;

            result.Add(new WishlistItemDto(
                item.Id,
                product.Id,
                product.Name,
                product.Price.Amount,
                product.Price.Currency,
                product.ImageUrl,
                product.Category?.Name ?? "",
                product.Stock.Value,
                product.IsActive,
                item.CreatedAt));
        }

        return result;
    }
}

public class GetWishlistProductIdsHandler : IRequestHandler<GetWishlistProductIdsQuery, IReadOnlyList<Guid>>
{
    private readonly IWishlistRepository _wishlist;
    public GetWishlistProductIdsHandler(IWishlistRepository wishlist) => _wishlist = wishlist;

    public async Task<IReadOnlyList<Guid>> Handle(GetWishlistProductIdsQuery q, CancellationToken ct)
        => await _wishlist.GetProductIdsByUserAsync(q.UserId, ct);
}
