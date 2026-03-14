using MediatR;

namespace ECommerce.Application.Identity.Commands;

public record AddUserAddressCommand(
    Guid UserId,
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
    int? DistrictId = null) : IRequest<Guid>;

public record UpdateUserAddressCommand(
    Guid AddressId,
    Guid UserId,
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null) : IRequest;

public record DeleteUserAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;

public record SetDefaultAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;
