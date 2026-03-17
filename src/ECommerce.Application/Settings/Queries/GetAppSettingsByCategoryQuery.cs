using ECommerce.Domain.Settings;
using MediatR;

namespace ECommerce.Application.Settings.Queries;

public record GetAppSettingsByCategoryQuery(string Category) : IRequest<string?>;

public class GetAppSettingsByCategoryHandler : IRequestHandler<GetAppSettingsByCategoryQuery, string?>
{
    private readonly IAppSettingsRepository _repo;

    public GetAppSettingsByCategoryHandler(IAppSettingsRepository repo) => _repo = repo;

    public async Task<string?> Handle(GetAppSettingsByCategoryQuery q, CancellationToken ct)
    {
        var entity = await _repo.GetByCategoryAsync(q.Category.ToLowerInvariant(), ct);
        return entity?.Settings;
    }
}
