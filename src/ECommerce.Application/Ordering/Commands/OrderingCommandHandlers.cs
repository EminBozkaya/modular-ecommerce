using ECommerce.Domain.Basket;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Entities;
using MediatR;

namespace ECommerce.Application.Ordering.Commands;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Guid>
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

    public async Task<Guid> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        var basket = cmd.UserId.HasValue
            ? await _baskets.GetByUserIdAsync(cmd.UserId.Value, ct)
            : await _baskets.GetBySessionIdAsync(cmd.SessionId!, ct);

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
        var orderItems = basket.Items.Select(i =>
            OrderItem.Create(i.ProductId, i.ProductName, i.UnitPriceSnapshot, i.Quantity));

        var order = Order.Create(cmd.UserId, cmd.GuestEmail, cmd.ShippingAddress, orderItems);

        // Decrease stock
        foreach (var item in basket.Items)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct)
                ?? throw new KeyNotFoundException($"Product {item.ProductId} not found.");
            product.DecreaseStock(item.Quantity);
        }

        await _orders.AddAsync(order, ct);
        basket.Clear();
        await _orders.SaveChangesAsync(ct);
        return order.Id;
    }
}
