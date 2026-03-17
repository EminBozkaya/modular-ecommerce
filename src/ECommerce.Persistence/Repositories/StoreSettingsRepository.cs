using ECommerce.Domain.Settings;
using ECommerce.Domain.Settings.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class StoreSettingsRepository : IStoreSettingsRepository
{
    private readonly ApplicationDbContext _ctx;

    public StoreSettingsRepository(ApplicationDbContext ctx) => _ctx = ctx;

    // Not AsNoTracking — this entity is updated in-place by the handler
    public async Task<StoreSettings?> GetAsync(CancellationToken ct = default)
        => await _ctx.Set<StoreSettings>().FirstOrDefaultAsync(ct);

    public async Task AddAsync(StoreSettings settings, CancellationToken ct = default)
        => await _ctx.Set<StoreSettings>().AddAsync(settings, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
