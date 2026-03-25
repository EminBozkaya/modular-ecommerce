using System.Text.Json.Serialization;

namespace ECommerce.Application.Settings.Dtos;

public record HeroSlideDto(
    string Id,
    string? ImageBase64,
    string? ImageUrl,
    string Title,
    string Subtitle,
    string Description,
    string TextColor,
    string OverlayColor,
    int OverlayOpacity,
    string ButtonText,
    string ButtonLink,
    bool ButtonVisible,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations = null
);

public record HeroCarouselDto(
    bool Enabled,
    string Effect,
    int Height,
    bool AutoPlay,
    int AutoPlayInterval,
    bool Loop,
    bool ShowArrows,
    bool ShowDots,
    List<HeroSlideDto> Slides
);
