using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;

namespace ECommerce.Domain.Basket.Entities;

public class Basket : BaseEntity
{
    // Null = guest user (session-based)
    public Guid? UserId { get; private set; }
    public string? SessionId { get; private set; }

    private readonly List<BasketItem> _items = [];
    public IReadOnlyCollection<BasketItem> Items => _items.AsReadOnly();

    public Money Total => _items.Count == 0 
        ? new Money(0, "TRY") 
        : _items.Skip(1).Aggregate(_items[0].LineTotalSnapshot, (acc, item) => acc.Add(item.LineTotalSnapshot));

    private Basket() { }

    public static Basket CreateForUser(Guid userId) =>
        new() { UserId = userId };

    public static Basket CreateForGuest(string sessionId) =>
        new() { SessionId = sessionId };

    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        var existing = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existing is not null)
            existing.ChangeQuantity(existing.Quantity + quantity);
        else
            _items.Add(BasketItem.Create(productId, productName, unitPrice, quantity));
    }

    public void RemoveItem(Guid productId)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        if (item is not null) _items.Remove(item);
    }

    public void Clear() => _items.Clear();
}
