using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Ordering.Queries;

public record OrderDto(
    Guid Id, string OrderNumber, string Status,
    decimal TotalAmount, string Currency,
    string ShippingAddress, DateTime CreatedAt,
    IReadOnlyList<OrderItemDto> Items);

public record OrderItemDto(
    Guid ProductId, string ProductName,
    decimal UnitPrice, int Quantity, decimal LineTotal);

public record GetOrdersQuery(Guid? UserId = null) : IRequest<IReadOnlyList<OrderDto>>;
public record GetPagedOrdersQuery(Guid? UserId = null, int Page = 1, int PageSize = 20) : IRequest<PagedResult<OrderDto>>;
public record GetOrderByIdQuery(Guid Id) : IRequest<OrderDto?>;
