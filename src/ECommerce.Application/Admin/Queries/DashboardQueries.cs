using ECommerce.Application.Catalog.Queries;
using ECommerce.Application.Ordering.Queries;
using MediatR;

namespace ECommerce.Application.Admin.Queries;

public record DashboardSummaryDto(
    int TotalOrders,
    decimal TotalRevenue,
    string RevenueCurrency,
    int TotalCustomers,
    int LowStockCount);

public record RevenueDataPointDto(string Date, decimal Revenue);

public record GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>;
public record GetRevenueChartQuery : IRequest<IReadOnlyList<RevenueDataPointDto>>;
public record GetRecentOrdersQuery(int Count = 10) : IRequest<IReadOnlyList<OrderDto>>;
public record GetLowStockProductsQuery(int Threshold = 5) : IRequest<IReadOnlyList<ProductDto>>;
