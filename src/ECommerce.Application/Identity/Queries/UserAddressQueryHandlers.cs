using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public class GetUserAddressesHandler : IRequestHandler<GetUserAddressesQuery, IReadOnlyList<UserAddressDto>>
{
    private readonly IUserAddressRepository _repo;
    public GetUserAddressesHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<UserAddressDto>> Handle(GetUserAddressesQuery query, CancellationToken ct)
    {
        // For customer view, we probably don't need UserFullName but consistency is good.
        // Repository doesn't include User in GetByUserIdAsync currently.
        var addresses = await _repo.GetByUserIdAsync(query.UserId, ct);
        return addresses.Select(a => new UserAddressDto(
            a.Id, a.Title, a.FullName,
            a.AddressLine1, a.AddressLine2,
            a.City, a.PostalCode, a.Country,
            a.IsDefault, a.IsActive, a.IsDeleted,
            a.CreatedAt, a.CreatedBy, a.UpdatedAt, a.UpdatedBy,
            a.CountryId, a.CityId, a.DistrictId, null)).ToList();
    }
}

public class GetAdminAddressesHandler : IRequestHandler<GetAdminAddressesQuery, IReadOnlyList<UserAddressDto>>
{
    private readonly IUserAddressRepository _repo;
    public GetAdminAddressesHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<UserAddressDto>> Handle(GetAdminAddressesQuery query, CancellationToken ct)
    {
        var addresses = await _repo.GetAllAsync(includeDeleted: true, ct: ct);
        return addresses.Select(a => new UserAddressDto(
            a.Id, a.Title, a.FullName,
            a.AddressLine1, a.AddressLine2,
            a.City, a.PostalCode, a.Country,
            a.IsDefault, a.IsActive, a.IsDeleted,
            a.CreatedAt, a.CreatedBy, a.UpdatedAt, a.UpdatedBy,
            a.CountryId, a.CityId, a.DistrictId, a.User?.FullName)).ToList();
    }
}
