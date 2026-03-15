using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public class GetCountriesHandler : IRequestHandler<GetCountriesQuery, IReadOnlyList<CountryDto>>
{
    private readonly ILocationRepository _repo;
    public GetCountriesHandler(ILocationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<CountryDto>> Handle(GetCountriesQuery request, CancellationToken ct)
    {
        var countries = await _repo.GetCountriesAsync(ct);
        return countries
            .Select(c => new CountryDto(c.Id, c.Name, c.IsoCode))
            .ToList();
    }
}

public class GetCitiesByCountryHandler : IRequestHandler<GetCitiesByCountryQuery, IReadOnlyList<CityDto>>
{
    private readonly ILocationRepository _repo;
    public GetCitiesByCountryHandler(ILocationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<CityDto>> Handle(GetCitiesByCountryQuery request, CancellationToken ct)
    {
        var cities = await _repo.GetCitiesByCountryAsync(request.CountryId, ct);
        return cities
            .Select(c => new CityDto(c.Id, c.CountryId, c.Name, c.PlateCode))
            .ToList();
    }
}

public class GetDistrictsByCityHandler : IRequestHandler<GetDistrictsByCityQuery, IReadOnlyList<DistrictDto>>
{
    private readonly ILocationRepository _repo;
    public GetDistrictsByCityHandler(ILocationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<DistrictDto>> Handle(GetDistrictsByCityQuery request, CancellationToken ct)
    {
        var districts = await _repo.GetDistrictsByCityAsync(request.CityId, ct);
        return districts
            .Select(d => new DistrictDto(d.Id, d.CityId, d.Name))
            .ToList();
    }
}
