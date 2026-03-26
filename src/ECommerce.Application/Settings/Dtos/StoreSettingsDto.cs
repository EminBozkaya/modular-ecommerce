namespace ECommerce.Application.Settings.Dtos;

public record StoreSettingsDto(
    // ── Brand identity ───────────────────────────────────────────────────────
    string? ImageBase64,
    string StoreName,
    bool ShowStoreNameInHeader,

    // ── Area / Section background colors ────────────────────────────────────
    string PrimaryColor,           // Marka ana rengi (buttons, form focus-ring…)
    string HeaderBackgroundColor,  // Header arka plan (ayrı tanımlanabilir)
    string BannerBackgroundColor,  // Kayan yazı bandı arka planı
    string BackgroundColor,        // Ana sayfa (storefront) arka plan rengi
    string AdminSidebarBackgroundColor,
    string AdminPageBackgroundColor,

    // ── Banner / marquee settings ────────────────────────────────────────────
    string FreeShippingBannerText,
    bool FreeShippingBannerVisible,
    bool FreeShippingBannerMarquee,
    int FreeShippingBannerMarqueeSpeed,

    // ── Background pattern ───────────────────────────────────────────────────
    string? BackgroundPatternBase64,
    int BackgroundPatternOpacity,

    // ── Text colors ──────────────────────────────────────────────────────────
    string NavbarActiveColor,       // backward-compat: active nav link colour
    string NavbarMenuTextColor,     // Navbar menü buton metin rengi (pasif link)
    string StoreNameColor,          // Header içindeki mağaza adı rengi
    string AvatarTextColor,         // Baş harf avatar içi metin (AY gibi)
    string HeaderIconTextColor,     // Header ikonları altındaki alt-metin rengi
    string BannerTextColor,         // Kayan yazı metin rengi
    string PageTitleColor,          // Sayfa başlıkları metin rengi
    string ProductCardCategoryColor,
    string ProductCardNameColor,
    string ProductCardQuantityColor,
    string ProductCardTotalColor,
    string ProductCardPriceColor,
    string ProductCardButtonColor,
    string AdminSidebarTextColor,
    string AdminPageTitleColor,
    string FooterTextColor,

    // ── Text fonts (system/cross-browser fonts only) ─────────────────────────
    string StoreNameFont,
    string AvatarTextFont,
    string HeaderIconTextFont,
    string NavbarMenuTextFont,
    string BannerTextFont,
    string PageTitleFont,
    string ProductCardCategoryFont,
    string ProductCardNameFont,
    string ProductCardQuantityFont,
    string ProductCardTotalFont,
    string ProductCardPriceFont,
    string ProductCardButtonFont,
    string AdminSidebarTextFont,
    string AdminPageTitleFont,
    string FooterTextFont,

    // ── Rich content ─────────────────────────────────────────────────────────
    HeroCarouselDto HeroCarousel,
    List<HomepageSectionDto> HomepageSections,
    FooterSettingsDto Footer,

    // ── Localization ────────────────────────────────────────────────────────
    Dictionary<string, Dictionary<string, string>>? Translations = null
);
