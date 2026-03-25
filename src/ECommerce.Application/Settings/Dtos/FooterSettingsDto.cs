using System.Text.Json.Serialization;

namespace ECommerce.Application.Settings.Dtos;

public record FooterLinkDto(
    string Id,
    string Label,
    string Url,
    int Order,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations = null
);

public record FooterSocialLinkDto(
    string Id,
    string Platform, // "instagram" | "facebook" | "twitter" | "youtube" | "linkedin" | "tiktok" | "whatsapp"
    string Url
);

public record FooterColumnDto(
    string Id,
    string Type,  // "links" | "contact" | "social" | "about"
    string Title,
    int Order,
    bool Enabled,
    List<FooterLinkDto>? Links,
    string? Address,
    string? Phone,
    string? Email,
    List<FooterSocialLinkDto>? SocialLinks,
    string? FollowText,
    bool? ShowLogo,
    string? Description,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations = null
);

public record FooterBottomLinkDto(
    string Id,
    string Label,
    string Url,
    int Order,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations = null
);

public record FooterSettingsDto(
    List<FooterColumnDto> Columns,
    string? BackgroundColor,
    string? TextColor,
    string CopyrightText,
    string BottomBarAlignment, // "left" | "center" | "between"
    List<FooterBottomLinkDto> BottomLinks
);
