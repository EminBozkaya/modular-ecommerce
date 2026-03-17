using System.Text.Json;
using ECommerce.Application.Settings.Dtos;
using ECommerce.Domain.Settings;
using MediatR;

namespace ECommerce.Application.Settings.Queries;

public record GetStoreSettingsQuery : IRequest<StoreSettingsDto>;

public class GetStoreSettingsHandler : IRequestHandler<GetStoreSettingsQuery, StoreSettingsDto>
{
    // White-label neutral defaults — used when the DB has no StoreSettings row.
    // Palette: #2C3E50 (Flat UI "Wet Asphalt") — deep blue-gray, professional,
    // suitable for any business vertical, no industry-specific connotations.
    private static readonly HeroCarouselDto _defaultCarousel = new(
        Enabled: true,
        Effect: "slide",
        Height: 500,
        AutoPlay: true,
        AutoPlayInterval: 5000,
        Loop: true,
        ShowArrows: true,
        ShowDots: true,
        Slides:
        [
            new HeroSlideDto(
                Id: "default-slide-1",
                ImageBase64: null,
                ImageUrl: null,
                Title: "Hoş Geldiniz",
                Subtitle: "Mağazamıza hoş geldiniz",
                Description: "En kaliteli ürünleri uygun fiyatlarla sunuyoruz.",
                TextColor: "#FFFFFF",
                OverlayColor: "#2C3E50",
                OverlayOpacity: 85,
                ButtonText: "Alışverişe Başla",
                ButtonLink: "/products",
                ButtonVisible: true
            ),
            new HeroSlideDto(
                Id: "default-slide-2",
                ImageBase64: null,
                ImageUrl: null,
                Title: "Özel Kampanyalar",
                Subtitle: "Seçili ürünlerde fırsatlar",
                Description: "Kaçırmayın, sınırlı süre geçerlidir.",
                TextColor: "#FFFFFF",
                OverlayColor: "#1A252F",
                OverlayOpacity: 80,
                ButtonText: "Fırsatları Keşfet",
                ButtonLink: "/products",
                ButtonVisible: true
            ),
        ]
    );

    private static readonly StoreSettingsDto _defaults = new(
        ImageBase64: null,
        StoreName: "Mağazam",
        ShowStoreNameInHeader: true,
        PrimaryColor: "#2C3E50",
        NavbarActiveColor: "#ECF0F1",
        FreeShippingBannerText: "Hızlı ve güvenli teslimat garantisiyle alışveriş yapın!",
        FreeShippingBannerVisible: false,
        FreeShippingBannerMarquee: false,
        FreeShippingBannerMarqueeSpeed: 5,
        BackgroundPatternBase64: null,
        BackgroundPatternOpacity: 20,
        BackgroundColor: "#F5F6F7",
        HeroCarousel: _defaultCarousel
    );

    private readonly IStoreSettingsRepository _repo;

    public GetStoreSettingsHandler(IStoreSettingsRepository repo) => _repo = repo;

    public async Task<StoreSettingsDto> Handle(GetStoreSettingsQuery _, CancellationToken ct)
    {
        var entity = await _repo.GetAsync(ct);
        if (entity is null) return _defaults;

        var data = TryDeserialize(entity.Settings);
        return new StoreSettingsDto(
            ImageBase64: entity.ImageBase64,
            StoreName: data?.StoreName ?? _defaults.StoreName,
            ShowStoreNameInHeader: data?.ShowStoreNameInHeader ?? _defaults.ShowStoreNameInHeader,
            PrimaryColor: data?.PrimaryColor ?? _defaults.PrimaryColor,
            NavbarActiveColor: data?.NavbarActiveColor ?? _defaults.NavbarActiveColor,
            FreeShippingBannerText: data?.FreeShippingBannerText ?? _defaults.FreeShippingBannerText,
            FreeShippingBannerVisible: data?.FreeShippingBannerVisible ?? _defaults.FreeShippingBannerVisible,
            FreeShippingBannerMarquee: data?.FreeShippingBannerMarquee ?? _defaults.FreeShippingBannerMarquee,
            FreeShippingBannerMarqueeSpeed: data?.FreeShippingBannerMarqueeSpeed ?? _defaults.FreeShippingBannerMarqueeSpeed,
            BackgroundPatternBase64: data?.BackgroundPatternBase64,
            BackgroundPatternOpacity: data?.BackgroundPatternOpacity ?? _defaults.BackgroundPatternOpacity,
            BackgroundColor: data?.BackgroundColor ?? _defaults.BackgroundColor,
            HeroCarousel: MapCarousel(data?.HeroCarousel)
        );
    }

    private HeroCarouselDto MapCarousel(CarouselData? c)
    {
        if (c is null) return _defaultCarousel;

        return new HeroCarouselDto(
            Enabled: c.Enabled ?? _defaultCarousel.Enabled,
            Effect: c.Effect ?? _defaultCarousel.Effect,
            Height: c.Height ?? _defaultCarousel.Height,
            AutoPlay: c.AutoPlay ?? _defaultCarousel.AutoPlay,
            AutoPlayInterval: c.AutoPlayInterval ?? _defaultCarousel.AutoPlayInterval,
            Loop: c.Loop ?? _defaultCarousel.Loop,
            ShowArrows: c.ShowArrows ?? _defaultCarousel.ShowArrows,
            ShowDots: c.ShowDots ?? _defaultCarousel.ShowDots,
            Slides: c.Slides?.Select(s => new HeroSlideDto(
                Id: s.Id ?? Guid.NewGuid().ToString(),
                ImageBase64: s.ImageBase64,
                ImageUrl: s.ImageUrl,
                Title: s.Title ?? string.Empty,
                Subtitle: s.Subtitle ?? string.Empty,
                Description: s.Description ?? string.Empty,
                TextColor: s.TextColor ?? "#FFFFFF",
                OverlayColor: s.OverlayColor ?? "#000000",
                OverlayOpacity: s.OverlayOpacity ?? 50,
                ButtonText: s.ButtonText ?? string.Empty,
                ButtonLink: s.ButtonLink ?? "/products",
                ButtonVisible: s.ButtonVisible ?? true
            )).ToList() ?? _defaultCarousel.Slides
        );
    }

    private static SettingsData? TryDeserialize(string json)
    {
        try { return JsonSerializer.Deserialize<SettingsData>(json, _jsonOptions); }
        catch { return null; }
    }

    private static readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web);

    private record SettingsData(
        string? StoreName,
        bool? ShowStoreNameInHeader,
        string? PrimaryColor,
        string? NavbarActiveColor,
        string? FreeShippingBannerText,
        bool? FreeShippingBannerVisible,
        bool? FreeShippingBannerMarquee,
        int? FreeShippingBannerMarqueeSpeed,
        string? BackgroundPatternBase64,
        int? BackgroundPatternOpacity,
        string? BackgroundColor,
        CarouselData? HeroCarousel
    );

    private record CarouselData(
        bool? Enabled,
        string? Effect,
        int? Height,
        bool? AutoPlay,
        int? AutoPlayInterval,
        bool? Loop,
        bool? ShowArrows,
        bool? ShowDots,
        List<SlideData>? Slides
    );

    private record SlideData(
        string? Id,
        string? ImageBase64,
        string? ImageUrl,
        string? Title,
        string? Subtitle,
        string? Description,
        string? TextColor,
        string? OverlayColor,
        int? OverlayOpacity,
        string? ButtonText,
        string? ButtonLink,
        bool? ButtonVisible
    );
}
