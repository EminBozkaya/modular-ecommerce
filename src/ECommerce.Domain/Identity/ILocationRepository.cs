using ECommerce.Domain.Identity.Entities;

namespace ECommerce.Domain.Identity;

/// <summary>
/// Read-only repository for geographic location data (Country / City / District).
/// </summary>
public interface ILocationRepository
{
    Task<IReadOnlyList<Country>> GetCountriesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<City>> GetCitiesByCountryAsync(int countryId, CancellationToken ct = default);
    Task<IReadOnlyList<District>> GetDistrictsByCityAsync(int cityId, CancellationToken ct = default);
}
