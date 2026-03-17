using System.Text.Json;
using ECommerce.Application.Settings.Dtos;
using ECommerce.Domain.Settings;
using ECommerce.Domain.Settings.Entities;
using MediatR;

namespace ECommerce.Application.Settings.Commands;

public record UpdateStoreSettingsCommand(
    string? ImageBase64,
    string StoreName,
    bool ShowStoreNameInHeader,
    string PrimaryColor,
    string NavbarActiveColor,
    string FreeShippingBannerText,
    bool FreeShippingBannerVisible,
    bool FreeShippingBannerMarquee,
    int FreeShippingBannerMarqueeSpeed,
    string? BackgroundPatternBase64,
    int BackgroundPatternOpacity,
    string BackgroundColor,
    HeroCarouselDto? HeroCarousel
) : IRequest;

public class UpdateStoreSettingsHandler : IRequestHandler<UpdateStoreSettingsCommand>
{
    private readonly IStoreSettingsRepository _repo;

    public UpdateStoreSettingsHandler(IStoreSettingsRepository repo) => _repo = repo;

    public async Task Handle(UpdateStoreSettingsCommand cmd, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(new
        {
            cmd.StoreName,
            cmd.ShowStoreNameInHeader,
            cmd.PrimaryColor,
            cmd.NavbarActiveColor,
            cmd.FreeShippingBannerText,
            cmd.FreeShippingBannerVisible,
            cmd.FreeShippingBannerMarquee,
            cmd.FreeShippingBannerMarqueeSpeed,
            cmd.BackgroundPatternBase64,
            cmd.BackgroundPatternOpacity,
            cmd.BackgroundColor,
            cmd.HeroCarousel,
        }, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        var existing = await _repo.GetAsync(ct);
        if (existing is null)
        {
            var created = StoreSettings.Create(cmd.ImageBase64, json);
            await _repo.AddAsync(created, ct);
        }
        else
        {
            existing.Update(cmd.ImageBase64, json);
        }

        await _repo.SaveChangesAsync(ct);
    }
}
