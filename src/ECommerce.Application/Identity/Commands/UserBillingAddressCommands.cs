using ECommerce.Domain.Ordering.Enums;
using MediatR;

namespace ECommerce.Application.Identity.Commands;

public record AddUserBillingAddressCommand(
    Guid UserId,
    string Title,
    InvoiceType InvoiceType,
    string? FullName,
    string? TcKimlikNo,
    string? CompanyName,
    string? TaxOffice,
    string? TaxNumber,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsDefault,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null) : IRequest<Guid>;

public record UpdateUserBillingAddressCommand(
    Guid AddressId,
    Guid UserId,
    string Title,
    InvoiceType InvoiceType,
    string? FullName,
    string? TcKimlikNo,
    string? CompanyName,
    string? TaxOffice,
    string? TaxNumber,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null) : IRequest;

public record DeleteUserBillingAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;

public record SetDefaultBillingAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;
