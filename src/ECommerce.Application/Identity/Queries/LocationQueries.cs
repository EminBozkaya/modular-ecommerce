using MediatR;

namespace ECommerce.Application.Identity.Queries;

// ── DTOs ──────────────────────────────────────────────────────────────────────

public record CountryDto(int Id, string Name, string IsoCode);
public record CityDto(int Id, int CountryId, string Name, int PlateCode);
public record DistrictDto(int Id, int CityId, string Name);

// ── Queries ───────────────────────────────────────────────────────────────────

public record GetCountriesQuery : IRequest<IReadOnlyList<CountryDto>>;
public record GetCitiesByCountryQuery(int CountryId) : IRequest<IReadOnlyList<CityDto>>;
public record GetDistrictsByCityQuery(int CityId) : IRequest<IReadOnlyList<DistrictDto>>;
