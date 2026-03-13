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
    bool IsDefault) : IRequest<Guid>;

public record UpdateUserAddressCommand(
    Guid AddressId,
    Guid UserId,
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country) : IRequest;

public record DeleteUserAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;

public record SetDefaultAddressCommand(
    Guid AddressId,
    Guid UserId) : IRequest;

// --- Admin Commands ---
public record AdminCreateAddressCommand(
    Guid UserId,
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsActive) : IRequest<Guid>;

public record AdminUpdateAddressCommand(
    Guid Id,
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsActive) : IRequest;

public record AdminDeleteAddressCommand(Guid Id) : IRequest;
public record AdminRestoreAddressCommand(Guid Id) : IRequest;
