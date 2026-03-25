using ECommerce.Domain.Ordering.Enums;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public record UserBillingAddressDto(
    Guid Id,
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
    bool IsActive,
    bool IsDeleted,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null,
    string? DistrictName = null,
    string? UserFullName = null);

public record GetUserBillingAddressesQuery(Guid UserId) : IRequest<IReadOnlyList<UserBillingAddressDto>>;
