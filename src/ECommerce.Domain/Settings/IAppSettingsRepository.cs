using ECommerce.Domain.Settings.Entities;

namespace ECommerce.Domain.Settings;

public interface IAppSettingsRepository
{
    Task<AppSettings?> GetByCategoryAsync(string category, CancellationToken ct = default);
    Task AddAsync(AppSettings settings, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
