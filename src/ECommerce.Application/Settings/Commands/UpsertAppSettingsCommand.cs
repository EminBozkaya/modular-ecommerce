using ECommerce.Domain.Settings;
using ECommerce.Domain.Settings.Entities;
using MediatR;

namespace ECommerce.Application.Settings.Commands;

public record UpsertAppSettingsCommand(string Category, string SettingsJson) : IRequest;

public class UpsertAppSettingsHandler : IRequestHandler<UpsertAppSettingsCommand>
{
    private readonly IAppSettingsRepository _repo;

    public UpsertAppSettingsHandler(IAppSettingsRepository repo) => _repo = repo;

    public async Task Handle(UpsertAppSettingsCommand cmd, CancellationToken ct)
    {
        var category = cmd.Category.ToLowerInvariant();
        var existing = await _repo.GetByCategoryAsync(category, ct);
        if (existing is null)
        {
            var created = AppSettings.Create(category, cmd.SettingsJson);
            await _repo.AddAsync(created, ct);
        }
        else
        {
            existing.Update(cmd.SettingsJson);
        }

        await _repo.SaveChangesAsync(ct);
    }
}
