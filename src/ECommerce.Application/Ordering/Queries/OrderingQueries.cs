using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Ordering.Queries;

public record ShippingAddressDto(
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country);

public record BillingAddressDto(
    string InvoiceType,
    string? FullName,
    string? TcKimlikNo,
    string? CompanyName,
    string? TaxOffice,
    string? TaxNumber,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country);

public record OrderDto(
    Guid Id, string OrderNumber, string Status,
    decimal TotalAmount, string Currency,
    ShippingAddressDto ShippingAddress,
    BillingAddressDto? BillingAddress,
    DateTime CreatedAt,
    IReadOnlyList<OrderItemDto> Items);

public record OrderItemDto(
    Guid ProductId, string ProductName,
    decimal UnitPrice, decimal Quantity, decimal LineTotal);

public record GetOrdersQuery(Guid? UserId = null) : IRequest<IReadOnlyList<OrderDto>>;
public record GetPagedOrdersQuery(Guid? UserId = null, int Page = 1, int PageSize = 20) : IRequest<PagedResult<OrderDto>>;
public record GetOrderByIdQuery(Guid Id) : IRequest<OrderDto?>;
