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
    bool IsActive,
    bool IsDeleted,
    DateTime CreatedAt,
    string? CreatedBy,
    DateTime? UpdatedAt,
    string? UpdatedBy,
    string? UserFullName = null);

public record GetUserAddressesQuery(Guid UserId) : IRequest<IReadOnlyList<UserAddressDto>>;
public record GetAdminAddressesQuery : IRequest<IReadOnlyList<UserAddressDto>>;
