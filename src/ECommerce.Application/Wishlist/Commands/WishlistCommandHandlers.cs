using ECommerce.Domain.Catalog;
using ECommerce.Domain.Wishlist;
using ECommerce.Domain.Wishlist.Entities;
using MediatR;

namespace ECommerce.Application.Wishlist.Commands;

public class AddToWishlistHandler : IRequestHandler<AddToWishlistCommand>
{
    private readonly IWishlistRepository _wishlist;
    private readonly IProductRepository _products;

    public AddToWishlistHandler(IWishlistRepository wishlist, IProductRepository products)
    {
        _wishlist = wishlist;
        _products = products;
    }

    public async Task Handle(AddToWishlistCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException("Product not found.");

        var exists = await _wishlist.ExistsAsync(cmd.UserId, cmd.ProductId, ct);
        if (exists) return;

        var item = WishlistItem.Create(cmd.UserId, cmd.ProductId);
        await _wishlist.AddAsync(item, ct);
        await _wishlist.SaveChangesAsync(ct);
    }
}

public class RemoveFromWishlistHandler : IRequestHandler<RemoveFromWishlistCommand>
{
    private readonly IWishlistRepository _wishlist;
    public RemoveFromWishlistHandler(IWishlistRepository wishlist) => _wishlist = wishlist;

    public async Task Handle(RemoveFromWishlistCommand cmd, CancellationToken ct)
    {
        var item = await _wishlist.GetByUserAndProductAsync(cmd.UserId, cmd.ProductId, ct);
        if (item is null) return;

        _wishlist.Remove(item);
        await _wishlist.SaveChangesAsync(ct);
    }
}

public class ClearWishlistHandler : IRequestHandler<ClearWishlistCommand>
{
    private readonly IWishlistRepository _wishlist;
    public ClearWishlistHandler(IWishlistRepository wishlist) => _wishlist = wishlist;

    public async Task Handle(ClearWishlistCommand cmd, CancellationToken ct)
    {
        var items = await _wishlist.GetByUserIdAsync(cmd.UserId, ct);
        foreach (var item in items)
            _wishlist.Remove(item);
        await _wishlist.SaveChangesAsync(ct);
    }
}
