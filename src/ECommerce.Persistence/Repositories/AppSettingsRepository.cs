using ECommerce.Domain.Settings;
using ECommerce.Domain.Settings.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class AppSettingsRepository : IAppSettingsRepository
{
    private readonly ApplicationDbContext _ctx;

    public AppSettingsRepository(ApplicationDbContext ctx) => _ctx = ctx;

    // Not AsNoTracking — entity is updated in-place
    public async Task<AppSettings?> GetByCategoryAsync(string category, CancellationToken ct = default)
        => await _ctx.Set<AppSettings>()
            .FirstOrDefaultAsync(s => s.Category == category.ToLowerInvariant(), ct);

    public async Task AddAsync(AppSettings settings, CancellationToken ct = default)
        => await _ctx.Set<AppSettings>().AddAsync(settings, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
