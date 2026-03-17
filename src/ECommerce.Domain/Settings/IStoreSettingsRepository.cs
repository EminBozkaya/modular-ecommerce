using ECommerce.Domain.Settings.Entities;

namespace ECommerce.Domain.Settings;

public interface IStoreSettingsRepository
{
    Task<StoreSettings?> GetAsync(CancellationToken ct = default);
    Task AddAsync(StoreSettings settings, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
