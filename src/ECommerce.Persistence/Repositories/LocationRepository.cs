using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly ApplicationDbContext _context;
    public LocationRepository(ApplicationDbContext context) => _context = context;

    public async Task<IReadOnlyList<Country>> GetCountriesAsync(CancellationToken ct = default)
    {
        return await _context.Countries
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<City>> GetCitiesByCountryAsync(int countryId, CancellationToken ct = default)
    {
        return await _context.Cities
            .AsNoTracking()
            .Where(c => c.CountryId == countryId)
            .OrderBy(c => c.PlateCode)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<District>> GetDistrictsByCityAsync(int cityId, CancellationToken ct = default)
    {
        return await _context.Districts
            .AsNoTracking()
            .Where(d => d.CityId == cityId)
            .OrderBy(d => d.Name)
            .ToListAsync(ct);
    }
}
