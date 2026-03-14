using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public class GetUserAddressesHandler : IRequestHandler<GetUserAddressesQuery, IReadOnlyList<UserAddressDto>>
{
    private readonly IUserAddressRepository _repo;
    public GetUserAddressesHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<UserAddressDto>> Handle(GetUserAddressesQuery query, CancellationToken ct)
    {
        var addresses = await _repo.GetByUserIdAsync(query.UserId, ct);
        return addresses.Select(a => new UserAddressDto(
            a.Id, a.Title, a.FullName,
            a.AddressLine1, a.AddressLine2,
            a.City, a.PostalCode, a.Country,
            a.IsDefault, a.CountryId, a.CityId, a.DistrictId)).ToList();
    }
}
