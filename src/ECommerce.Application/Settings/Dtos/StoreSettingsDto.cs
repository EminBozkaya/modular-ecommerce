namespace ECommerce.Application.Settings.Dtos;

public record StoreSettingsDto(
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
    HeroCarouselDto HeroCarousel
);
