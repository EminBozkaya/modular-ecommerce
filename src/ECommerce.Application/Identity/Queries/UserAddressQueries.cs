using MediatR;

namespace ECommerce.Application.Identity.Queries;

public record UserAddressDto(
    Guid Id,
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsDefault,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null);

public record GetUserAddressesQuery(Guid UserId) : IRequest<IReadOnlyList<UserAddressDto>>;
