using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;

namespace ECommerce.Domain.Basket.Entities;

public class BasketItem : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = default!;

    /// <summary>
    /// Price captured at the moment the item was added to the basket.
    /// This snapshot is never updated from Product — it preserves the price the user saw.
    /// </summary>
    public Money UnitPriceSnapshot { get; private set; } = default!;

    public int Quantity { get; private set; }

    public Money LineTotalSnapshot => UnitPriceSnapshot.Multiply(Quantity);

    private BasketItem() { }

    public static BasketItem Create(Guid productId, string productName, Money unitPriceSnapshot, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");
        return new BasketItem
        {
            ProductId = productId,
            ProductName = productName,
            UnitPriceSnapshot = unitPriceSnapshot,
            Quantity = quantity
        };
    }

    public void ChangeQuantity(int newQuantity)
    {
        if (newQuantity <= 0) throw new ArgumentException("Quantity must be positive.");
        Quantity = newQuantity;
    }
}
