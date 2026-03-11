using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Domain.Ordering.Enums;
using MediatR;

namespace ECommerce.Application.Ordering.Commands;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, CreateOrderResult>
{
    private readonly IOrderRepository _orders;
    private readonly IBasketRepository _baskets;
    private readonly IProductRepository _products;

    public CreateOrderHandler(IOrderRepository orders, IBasketRepository baskets, IProductRepository products)
    {
        _orders = orders;
        _baskets = baskets;
        _products = products;
    }

    public async Task<CreateOrderResult> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        var basket = cmd.UserId.HasValue
            ? await _baskets.GetByUserIdTrackedAsync(cmd.UserId.Value, ct)
            : await _baskets.GetBySessionIdTrackedAsync(cmd.SessionId!, ct);

        if (basket is null || !basket.Items.Any())
            throw new InvalidOperationException("Basket is empty.");

        // Checkout price validation — compare snapshot vs current product price
        foreach (var item in basket.Items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct)
                ?? throw new KeyNotFoundException($"Product {item.ProductId} not found.");

            if (item.UnitPriceSnapshot != product.Price)
                throw new InvalidOperationException(
                    "One or more item prices have changed. Please review your cart.");
        }

        // Build order using snapshot prices (basket = advisory, order = legal commitment)
        // Quantity is cast to int: orders always commit in whole units even for weight-based products
        var orderItems = basket.Items.Select(i =>
            OrderItem.Create(i.ProductId, i.ProductName, i.UnitPriceSnapshot, (int)Math.Ceiling(i.Quantity)));

        var order = Order.Create(cmd.UserId, cmd.GuestEmail, cmd.ShippingAddress, orderItems);

        // Decrease stock — ceiling ensures fractional quantities consume at least 1 stock unit
        foreach (var item in basket.Items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct)
                ?? throw new KeyNotFoundException($"Product {item.ProductId} not found.");
            product.DecreaseStock((int)Math.Ceiling(item.Quantity));
        }

        await _orders.AddAsync(order, ct);
        basket.Clear();
        await _orders.SaveChangesAsync(ct);
        return new CreateOrderResult(order.Id, order.Total.Amount, order.Total.Currency.ToString());
    }
}

public class UpdateOrderStatusHandler : IRequestHandler<UpdateOrderStatusCommand>
{
    private readonly IOrderRepository _orders;
    public UpdateOrderStatusHandler(IOrderRepository orders) => _orders = orders;

    public async Task Handle(UpdateOrderStatusCommand cmd, CancellationToken ct)
    {
        var order = await _orders.GetByIdTrackedAsync(cmd.OrderId, ct)
            ?? throw new KeyNotFoundException($"Order {cmd.OrderId} not found.");

        if (!Enum.TryParse<OrderStatus>(cmd.NewStatus, ignoreCase: true, out var newStatus))
            throw new ArgumentException($"Invalid order status: {cmd.NewStatus}");

        switch (newStatus)
        {
            case OrderStatus.Paid: order.MarkAsPaid(); break;
            case OrderStatus.Processing: order.MarkAsProcessing(); break;
            case OrderStatus.Shipped: order.MarkAsShipped(); break;
            case OrderStatus.Delivered: order.MarkAsDelivered(); break;
            case OrderStatus.Cancelled: order.Cancel(); break;
            default: throw new InvalidOperationException($"Cannot transition to status: {newStatus}");
        }

        await _orders.SaveChangesAsync(ct);
    }
}

public class DeleteOrderHandler : IRequestHandler<DeleteOrderCommand>
{
    private readonly IOrderRepository _orders;
    public DeleteOrderHandler(IOrderRepository orders) => _orders = orders;

    public async Task Handle(DeleteOrderCommand cmd, CancellationToken ct)
    {
        var order = await _orders.GetByIdTrackedAsync(cmd.OrderId, ct)
            ?? throw new KeyNotFoundException($"Order {cmd.OrderId} not found.");
        order.IsDeleted = true;
        order.DeletedAt = DateTime.UtcNow;
        await _orders.SaveChangesAsync(ct);
    }
}

public class RestoreOrderHandler : IRequestHandler<RestoreOrderCommand>
{
    private readonly IOrderRepository _orders;
    public RestoreOrderHandler(IOrderRepository orders) => _orders = orders;

    public async Task Handle(RestoreOrderCommand cmd, CancellationToken ct)
    {
        var order = await _orders.GetByIdTrackedAsync(cmd.OrderId, ct)
            ?? throw new KeyNotFoundException($"Order {cmd.OrderId} not found.");
        order.IsDeleted = false;
        order.DeletedAt = null;
        await _orders.SaveChangesAsync(ct);
    }
}
