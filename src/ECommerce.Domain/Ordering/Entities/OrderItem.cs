using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;

namespace ECommerce.Domain.Ordering.Entities;

public class OrderItem : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = default!;
    public Money UnitPrice { get; private set; } = default!;
    public int Quantity { get; private set; }
    public Money LineTotal => UnitPrice.Multiply(Quantity);

    private OrderItem() { }

    public static OrderItem Create(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");
        return new OrderItem
        {
            ProductId = productId,
            ProductName = productName,
            UnitPrice = unitPrice,
            Quantity = quantity
        };
    }
}
