using ECommerce.Application.Catalog.Queries;
using ECommerce.Application.Ordering.Queries;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Identity;
using ECommerce.Domain.Ordering;
using MediatR;

namespace ECommerce.Application.Admin.Queries;

public class GetDashboardSummaryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IOrderRepository _orders;
    private readonly IUserRepository _users;
    private readonly IProductRepository _products;

    public GetDashboardSummaryHandler(IOrderRepository orders, IUserRepository users, IProductRepository products)
    {
        _orders = orders;
        _users = users;
        _products = products;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery q, CancellationToken ct)
    {
        var allOrders = await _orders.GetAllWithItemsAsync(null, ct);
        var allUsers = await _users.GetAllAsync(ct);
        var allProducts = await _products.GetAllActiveAsync(ct);

        var totalRevenue = allOrders
            .Where(o => o.Status != Domain.Ordering.Enums.OrderStatus.Cancelled)
            .Sum(o => o.Total.Amount);

        var revenueCurrency = allOrders.FirstOrDefault()?.Total.Currency ?? "TRY";
        var lowStockCount = allProducts.Count(p => p.Stock.Value <= 5);

        return new DashboardSummaryDto(
            allOrders.Count,
            totalRevenue,
            revenueCurrency,
            allUsers.Count,
            lowStockCount);
    }
}

public class GetRevenueChartHandler : IRequestHandler<GetRevenueChartQuery, IReadOnlyList<RevenueDataPointDto>>
{
    private readonly IOrderRepository _orders;

    public GetRevenueChartHandler(IOrderRepository orders) => _orders = orders;

    public async Task<IReadOnlyList<RevenueDataPointDto>> Handle(GetRevenueChartQuery q, CancellationToken ct)
    {
        var allOrders = await _orders.GetAllWithItemsAsync(null, ct);
        var cutoff = DateTime.UtcNow.Date.AddDays(-29);

        return allOrders
            .Where(o => o.CreatedAt.Date >= cutoff
                     && o.Status != Domain.Ordering.Enums.OrderStatus.Cancelled)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new RevenueDataPointDto(
                g.Key.ToString("yyyy-MM-dd"),
                g.Sum(o => o.Total.Amount)))
            .OrderBy(x => x.Date)
            .ToList();
    }
}

public class GetRecentOrdersHandler : IRequestHandler<GetRecentOrdersQuery, IReadOnlyList<OrderDto>>
{
    private readonly IOrderRepository _orders;

    public GetRecentOrdersHandler(IOrderRepository orders) => _orders = orders;

    public async Task<IReadOnlyList<OrderDto>> Handle(GetRecentOrdersQuery q, CancellationToken ct)
    {
        var (orders, _) = await _orders.GetPagedAsync(null, 1, q.Count, ct);
        return orders.Select(o => new OrderDto(
            o.Id, o.OrderNumber, o.Status.ToString(),
            o.Total.Amount, o.Total.Currency, ShippingAddressParser.Parse(o.ShippingAddress), o.CreatedAt,
            o.Items.Select(i => new OrderItemDto(
                i.ProductId, i.ProductName,
                i.UnitPrice.Amount, i.Quantity, i.LineTotal.Amount)).ToList())).ToList();
    }
}

public class GetLowStockProductsHandler : IRequestHandler<GetLowStockProductsQuery, IReadOnlyList<ProductDto>>
{
    private readonly IProductRepository _products;

    public GetLowStockProductsHandler(IProductRepository products) => _products = products;

    public async Task<IReadOnlyList<ProductDto>> Handle(GetLowStockProductsQuery q, CancellationToken ct)
    {
        var allProducts = await _products.GetAllActiveAsync(ct);

        return allProducts
            .Where(p => p.Stock.Value <= q.Threshold)
            .OrderBy(p => p.Stock.Value)
            .Select(p => new ProductDto(
                p.Id, p.Name, p.Description, p.ImageUrl,
                p.Price.Amount, p.Price.Currency,
                p.Stock.Value, p.IsActive,
                p.CategoryId, p.Category?.Name,
                p.UnitId, p.Unit?.Name,
                p.CreatedAt, p.CreatedBy,
                p.UpdatedAt, p.UpdatedBy,
                p.DeletedAt, p.IsDeleted))
            .ToList();
    }
}
