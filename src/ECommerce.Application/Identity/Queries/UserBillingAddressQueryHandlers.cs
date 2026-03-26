using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public class GetUserBillingAddressesHandler : IRequestHandler<GetUserBillingAddressesQuery, IReadOnlyList<UserBillingAddressDto>>
{
    private readonly IUserBillingAddressRepository _repo;
    public GetUserBillingAddressesHandler(IUserBillingAddressRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<UserBillingAddressDto>> Handle(GetUserBillingAddressesQuery query, CancellationToken ct)
    {
        var addresses = await _repo.GetByUserIdAsync(query.UserId, ct);
        return addresses.Select(a => new UserBillingAddressDto(
            a.Id, a.Title, a.InvoiceType,
            a.FullName, a.TcKimlikNo,
            a.CompanyName, a.TaxOffice, a.TaxNumber,
            a.AddressLine1, a.AddressLine2,
            a.City, a.PostalCode, a.Country,
            a.IsDefault, a.IsActive, a.IsDeleted,
            a.CreatedAt, a.UpdatedAt,
            a.CountryId, a.CityId, a.DistrictId, a.DistrictRef?.Name, null)).ToList();
    }
}
