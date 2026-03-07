using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;
using ECommerce.Domain.Ordering.Enums;

namespace ECommerce.Domain.Ordering.Entities;

public class Order : BaseAuditableEntity
{
    public string OrderNumber { get; private set; } = default!;
    public Guid? UserId { get; private set; }        // null = guest
    public string? GuestEmail { get; private set; }

    public string ShippingAddress { get; private set; } = default!;
    public OrderStatus Status { get; private set; }

    private readonly List<OrderItem> _items = [];
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public Money Total => _items.Count == 0 
        ? new Money(0, "TRY") 
        : _items.Skip(1).Aggregate(_items[0].LineTotal, (acc, item) => acc.Add(item.LineTotal));

    private Order() { }

    public static Order Create(
        Guid? userId,
        string? guestEmail,
        string shippingAddress,
        IEnumerable<OrderItem> items)
    {
        if (userId is null && string.IsNullOrWhiteSpace(guestEmail))
            throw new ArgumentException("Guest orders require an email address.");

        ArgumentException.ThrowIfNullOrWhiteSpace(shippingAddress);

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
            UserId = userId,
            GuestEmail = guestEmail,
            ShippingAddress = shippingAddress,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var item in items)
            order._items.Add(item);

        if (!order._items.Any())
            throw new InvalidOperationException("An order must have at least one item.");

        return order;
    }

    public void MarkAsPaid() => Transition(OrderStatus.Paid);
    public void MarkAsProcessing() => Transition(OrderStatus.Processing);
    public void MarkAsShipped() => Transition(OrderStatus.Shipped);
    public void MarkAsDelivered() => Transition(OrderStatus.Delivered);
    public void Cancel()
    {
        if (Status >= OrderStatus.Shipped)
            throw new InvalidOperationException("Cannot cancel a shipped or delivered order.");
        Transition(OrderStatus.Cancelled);
    }

    private void Transition(OrderStatus next)
    {
        Status = next;
        UpdatedAt = DateTime.UtcNow;
    }
}
