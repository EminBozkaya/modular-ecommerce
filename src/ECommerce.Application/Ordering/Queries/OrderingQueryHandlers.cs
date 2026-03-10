using ECommerce.Application.Common.Models;
using ECommerce.Domain.Ordering;
using MediatR;

namespace ECommerce.Application.Ordering.Queries;

public class GetOrdersHandler : IRequestHandler<GetOrdersQuery, IReadOnlyList<OrderDto>>
{
    private readonly IOrderRepository _orders;
    public GetOrdersHandler(IOrderRepository orders) => _orders = orders;

    public async Task<IReadOnlyList<OrderDto>> Handle(GetOrdersQuery q, CancellationToken ct)
    {
        var orders = await _orders.GetAllWithItemsAsync(q.UserId, ct);
        return orders.Select(o => new OrderDto(o.Id, o.OrderNumber, o.Status.ToString(),
            o.Total.Amount, o.Total.Currency, o.ShippingAddress, o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(i.ProductId, i.ProductName,
                i.UnitPrice.Amount, i.Quantity, i.LineTotal.Amount)).ToList()))
            .ToList();
    }
}

public class GetPagedOrdersHandler : IRequestHandler<GetPagedOrdersQuery, PagedResult<OrderDto>>
{
    private readonly IOrderRepository _orders;
    public GetPagedOrdersHandler(IOrderRepository orders) => _orders = orders;

    public async Task<PagedResult<OrderDto>> Handle(GetPagedOrdersQuery q, CancellationToken ct)
    {
        var (orders, total) = await _orders.GetPagedAsync(q.UserId, q.Page, q.PageSize, ct);
        var items = orders.Select(o => new OrderDto(o.Id, o.OrderNumber, o.Status.ToString(),
            o.Total.Amount, o.Total.Currency, o.ShippingAddress, o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(i.ProductId, i.ProductName,
                i.UnitPrice.Amount, i.Quantity, i.LineTotal.Amount)).ToList())).ToList();
        return new PagedResult<OrderDto>(items, total, q.Page, q.PageSize);
    }
}

public class GetOrderByIdHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly IOrderRepository _orders;
    public GetOrderByIdHandler(IOrderRepository orders) => _orders = orders;

    public async Task<OrderDto?> Handle(GetOrderByIdQuery q, CancellationToken ct)
    {
        var o = await _orders.GetByIdWithItemsAsync(q.Id, ct);
        if (o is null) return null;
        return new OrderDto(o.Id, o.OrderNumber, o.Status.ToString(),
            o.Total.Amount, o.Total.Currency, o.ShippingAddress, o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(i.ProductId, i.ProductName,
                i.UnitPrice.Amount, i.Quantity, i.LineTotal.Amount)).ToList());
    }
}
