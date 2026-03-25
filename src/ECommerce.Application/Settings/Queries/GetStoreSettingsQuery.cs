using System.Text.Json;
using System.Text.Json.Serialization;
using ECommerce.Application.Common.Caching;
using ECommerce.Application.Settings.Dtos;
using ECommerce.Domain.Settings;
using MediatR;

namespace ECommerce.Application.Settings.Queries;

public record GetStoreSettingsQuery : IRequest<StoreSettingsDto>, ICacheableQuery
{
    public string CacheKey => "store:settings";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}

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

    private static readonly List<HomepageSectionDto> _defaultSections =
        [
            new HomepageSectionDto(
                Id: "default-categories",
                Title: "Main Categories",
                ShowTitle: false,
                Layout: "grid",
                Columns: 3,
                BackgroundColor: "transparent",
                PaddingY: 48,
                Order: 0,
                Enabled: true,
                Cards:
                [
                    new SectionCardDto(Id: "cat-1", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/cat-a/400/300",
                        Title: "CATEGORY A", Subtitle: "", Description: "", TextPosition: "bottom-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 30, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products?categoryId=1", ButtonText: null, ButtonVisible: false,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "cat-2", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/cat-b/400/300",
                        Title: "CATEGORY B", Subtitle: "", Description: "", TextPosition: "bottom-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 30, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products?categoryId=2", ButtonText: null, ButtonVisible: false,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "cat-3", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/cat-c/400/300",
                        Title: "CATEGORY C", Subtitle: "", Description: "", TextPosition: "bottom-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 30, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products?categoryId=3", ButtonText: null, ButtonVisible: false,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                ]
            ),
            new HomepageSectionDto(
                Id: "default-featured",
                Title: "Featured Products",
                ShowTitle: false,
                Layout: "featured",
                Columns: 3,
                BackgroundColor: "transparent",
                PaddingY: 32,
                Order: 1,
                Enabled: true,
                Cards:
                [
                    new SectionCardDto(Id: "feat-1", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/featured-1/400/500",
                        Title: "WEEKLY DEAL", Subtitle: "Special discounts on selected products.", Description: "", TextPosition: "bottom-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 40, BadgeText: "Sale", BadgeColor: "#D4A853", BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products", ButtonText: "SHOP NOW", ButtonVisible: true,
                        AspectRatio: "auto", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "feat-2", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/featured-2/400/300",
                        Title: "NEW ARRIVALS", Subtitle: "Discover the latest additions to our collection.", Description: "", TextPosition: "center", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 40, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products", ButtonText: "EXPLORE", ButtonVisible: true,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "feat-3", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/featured-3/400/200",
                        Title: "BEST SELLERS", Subtitle: "Our most popular products.", Description: "", TextPosition: "top-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 35, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products", ButtonText: "SHOP NOW", ButtonVisible: true,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "feat-4", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/featured-4/400/200",
                        Title: "GIFTS", Subtitle: "Perfect gift ideas for your loved ones!", Description: "", TextPosition: "top-left", TextColor: "#FFFFFF",
                        OverlayColor: "#000000", OverlayOpacity: 35, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products", ButtonText: "SHOP NOW", ButtonVisible: true,
                        AspectRatio: "landscape", ColSpan: 1, RowSpan: 1),
                ]
            ),
            new HomepageSectionDto(
                Id: "default-satisfaction",
                Title: "100% SATISFACTION GUARANTEE",
                ShowTitle: true,
                Layout: "banner",
                Columns: 1,
                BackgroundColor: "transparent",
                PaddingY: 80,
                Order: 2,
                Enabled: true,
                Cards:
                [
                    new SectionCardDto(Id: "banner-1", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/banner-1/1920/600",
                        Title: "100% SATISFACTION GUARANTEE", Subtitle: "", Description: "We are committed to providing the highest quality products and services. If you are not satisfied, we will make it right.",
                        TextPosition: "center", TextColor: "#FFFFFF",
                        OverlayColor: "#2C3E50", OverlayOpacity: 85, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "url", LinkTarget: "/products", ButtonText: "LEARN MORE", ButtonVisible: true,
                        AspectRatio: "auto", ColSpan: 1, RowSpan: 1),
                ]
            ),
            new HomepageSectionDto(
                Id: "default-news",
                Title: "NEWS & TIPS",
                ShowTitle: true,
                Layout: "grid",
                Columns: 2,
                BackgroundColor: "transparent",
                PaddingY: 64,
                Order: 3,
                Enabled: true,
                Cards:
                [
                    new SectionCardDto(Id: "news-1", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/news-1/200/200",
                        Title: "ON SALE NOW!", Subtitle: "", Description: "Special discounts on selected products. Limited time offer — don't miss out!",
                        TextPosition: "center", TextColor: "#333333",
                        OverlayColor: "#000000", OverlayOpacity: 0, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "none", LinkTarget: null, ButtonText: "READ MORE", ButtonVisible: true,
                        AspectRatio: "square", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "news-2", ImageBase64: null, ImageUrl: "https://picsum.photos/seed/news-2/200/200",
                        Title: "NEW COLLECTION", Subtitle: "", Description: "Check out our latest products and expanded range of items now available.",
                        TextPosition: "center", TextColor: "#333333",
                        OverlayColor: "#000000", OverlayOpacity: 0, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "none", LinkTarget: null, ButtonText: "READ MORE", ButtonVisible: true,
                        AspectRatio: "square", ColSpan: 1, RowSpan: 1),
                ]
            ),
            new HomepageSectionDto(
                Id: "default-testimonials",
                Title: "WHAT OUR CUSTOMERS SAY",
                ShowTitle: true,
                Layout: "grid",
                Columns: 3,
                BackgroundColor: "transparent",
                PaddingY: 64,
                Order: 4,
                Enabled: true,
                Cards:
                [
                    new SectionCardDto(Id: "test-1", ImageBase64: null, ImageUrl: null,
                        Title: "Alex M.", Subtitle: "Berlin", Description: "Great products and fast delivery. Very satisfied, thank you!",
                        TextPosition: "center", TextColor: "#333333",
                        OverlayColor: "#000000", OverlayOpacity: 0, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "none", LinkTarget: null, ButtonText: null, ButtonVisible: false,
                        AspectRatio: "auto", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "test-2", ImageBase64: null, ImageUrl: null,
                        Title: "Sarah L.", Subtitle: "London", Description: "Product quality exceeded my expectations. Will definitely order again.",
                        TextPosition: "center", TextColor: "#333333",
                        OverlayColor: "#000000", OverlayOpacity: 0, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "none", LinkTarget: null, ButtonText: null, ButtonVisible: false,
                        AspectRatio: "auto", ColSpan: 1, RowSpan: 1),
                    new SectionCardDto(Id: "test-3", ImageBase64: null, ImageUrl: null,
                        Title: "Yuki T.", Subtitle: "Tokyo", Description: "Excellent customer service. Products arrived on time and without any issues.",
                        TextPosition: "center", TextColor: "#333333",
                        OverlayColor: "#000000", OverlayOpacity: 0, BadgeText: null, BadgeColor: null, BadgePosition: "top-left",
                        LinkType: "none", LinkTarget: null, ButtonText: null, ButtonVisible: false,
                        AspectRatio: "auto", ColSpan: 1, RowSpan: 1),
                ]
            ),
        ];

    private static readonly FooterSettingsDto _defaultFooter = new(
        Columns:
        [
            new FooterColumnDto(
                Id: "footer-col-1", Type: "links", Title: "ABOUT US",
                Order: 0, Enabled: true,
                Links:
                [
                    new FooterLinkDto("fl-1", "References", "#", 0),
                    new FooterLinkDto("fl-2", "FAQ", "#", 1),
                    new FooterLinkDto("fl-3", "Customer Service", "#", 2),
                ],
                Address: null, Phone: null, Email: null,
                SocialLinks: null, FollowText: null,
                ShowLogo: null, Description: null
            ),
            new FooterColumnDto(
                Id: "footer-col-2", Type: "links", Title: "NEWS & TIPS",
                Order: 1, Enabled: true,
                Links:
                [
                    new FooterLinkDto("fl-4", "Latest News", "#", 0),
                    new FooterLinkDto("fl-5", "Knowledge Base", "#", 1),
                    new FooterLinkDto("fl-6", "Guides", "#", 2),
                ],
                Address: null, Phone: null, Email: null,
                SocialLinks: null, FollowText: null,
                ShowLogo: null, Description: null
            ),
            new FooterColumnDto(
                Id: "footer-col-3", Type: "contact", Title: "CONTACT",
                Order: 2, Enabled: true,
                Links: null,
                Address: "123 Main Street\nNew York, NY 10001",
                Phone: "+1 (555) 000-0000",
                Email: null,
                SocialLinks: null, FollowText: null,
                ShowLogo: null, Description: null
            ),
            new FooterColumnDto(
                Id: "footer-col-4", Type: "social", Title: "SOCIAL MEDIA",
                Order: 3, Enabled: true,
                Links: null,
                Address: null, Phone: null, Email: null,
                SocialLinks:
                [
                    new FooterSocialLinkDto("fsl-1", "facebook", "#"),
                    new FooterSocialLinkDto("fsl-2", "twitter", "#"),
                    new FooterSocialLinkDto("fsl-3", "instagram", "#"),
                ],
                FollowText: "Follow us:",
                ShowLogo: null, Description: null
            ),
        ],
        BackgroundColor: null,
        TextColor: null,
        CopyrightText: "All rights reserved.",
        BottomBarAlignment: "between",
        BottomLinks:
        [
            new FooterBottomLinkDto("fbl-1", "Terms of Service", "#", 0),
            new FooterBottomLinkDto("fbl-2", "Privacy Policy", "#", 1),
            new FooterBottomLinkDto("fbl-3", "Legal Notice", "#", 2),
        ]
    );

    private static readonly StoreSettingsDto _defaults = new(
        ImageBase64: null,
        StoreName: "Mağazam",
        ShowStoreNameInHeader: true,
        // area bg colors
        PrimaryColor: "#2C3E50",
        HeaderBackgroundColor: "#2C3E50",
        BannerBackgroundColor: "#243342",
        BackgroundColor: "#F5F6F7",
        AdminSidebarBackgroundColor: "#2C3E50",
        AdminPageBackgroundColor: "#F4F6F8",
        // banner
        FreeShippingBannerText: "Hızlı ve güvenli teslimat garantisiyle alışveriş yapın!",
        FreeShippingBannerVisible: false,
        FreeShippingBannerMarquee: false,
        FreeShippingBannerMarqueeSpeed: 5,
        // pattern
        BackgroundPatternBase64: null,
        BackgroundPatternOpacity: 20,
        // text colors
        NavbarActiveColor: "#ECF0F1",
        NavbarMenuTextColor: "#ECF0F1",
        StoreNameColor: "#FFFFFF",
        AvatarTextColor: "#FFFFFF",
        HeaderIconTextColor: "#ECF0F1",
        BannerTextColor: "#FFFFFF",
        PageTitleColor: "#1F2937",
        ProductCardCategoryColor: "#6B7280",
        ProductCardNameColor: "#111827",
        ProductCardQuantityColor: "#6B7280",
        ProductCardTotalColor: "#374151",
        ProductCardPriceColor: "#2C3E50",
        ProductCardButtonColor: "#2C3E50",
        AdminSidebarTextColor: "#ECF0F1",
        AdminPageTitleColor: "#2C3E50",
        FooterTextColor: "#D1D5DB",
        // fonts
        StoreNameFont: "Arial, Helvetica, sans-serif",
        AvatarTextFont: "Arial, Helvetica, sans-serif",
        HeaderIconTextFont: "Arial, Helvetica, sans-serif",
        NavbarMenuTextFont: "Arial, Helvetica, sans-serif",
        BannerTextFont: "Arial, Helvetica, sans-serif",
        PageTitleFont: "Arial, Helvetica, sans-serif",
        ProductCardCategoryFont: "Arial, Helvetica, sans-serif",
        ProductCardNameFont: "Arial, Helvetica, sans-serif",
        ProductCardQuantityFont: "Arial, Helvetica, sans-serif",
        ProductCardTotalFont: "Arial, Helvetica, sans-serif",
        ProductCardPriceFont: "Arial, Helvetica, sans-serif",
        ProductCardButtonFont: "Arial, Helvetica, sans-serif",
        AdminSidebarTextFont: "Arial, Helvetica, sans-serif",
        AdminPageTitleFont: "Arial, Helvetica, sans-serif",
        FooterTextFont: "Arial, Helvetica, sans-serif",
        HeroCarousel: _defaultCarousel,
        HomepageSections: _defaultSections,
        Footer: _defaultFooter
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
            // area bg colors
            PrimaryColor: data?.PrimaryColor ?? _defaults.PrimaryColor,
            HeaderBackgroundColor: data?.HeaderBackgroundColor ?? _defaults.HeaderBackgroundColor,
            BannerBackgroundColor: data?.BannerBackgroundColor ?? _defaults.BannerBackgroundColor,
            BackgroundColor: data?.BackgroundColor ?? _defaults.BackgroundColor,
            AdminSidebarBackgroundColor: data?.AdminSidebarBackgroundColor ?? _defaults.AdminSidebarBackgroundColor,
            AdminPageBackgroundColor: data?.AdminPageBackgroundColor ?? _defaults.AdminPageBackgroundColor,
            // banner
            FreeShippingBannerText: data?.FreeShippingBannerText ?? _defaults.FreeShippingBannerText,
            FreeShippingBannerVisible: data?.FreeShippingBannerVisible ?? _defaults.FreeShippingBannerVisible,
            FreeShippingBannerMarquee: data?.FreeShippingBannerMarquee ?? _defaults.FreeShippingBannerMarquee,
            FreeShippingBannerMarqueeSpeed: data?.FreeShippingBannerMarqueeSpeed ?? _defaults.FreeShippingBannerMarqueeSpeed,
            // pattern
            BackgroundPatternBase64: data?.BackgroundPatternBase64,
            BackgroundPatternOpacity: data?.BackgroundPatternOpacity ?? _defaults.BackgroundPatternOpacity,
            // text colors
            NavbarActiveColor: data?.NavbarActiveColor ?? _defaults.NavbarActiveColor,
            NavbarMenuTextColor: data?.NavbarMenuTextColor ?? _defaults.NavbarMenuTextColor,
            StoreNameColor: data?.StoreNameColor ?? _defaults.StoreNameColor,
            AvatarTextColor: data?.AvatarTextColor ?? _defaults.AvatarTextColor,
            HeaderIconTextColor: data?.HeaderIconTextColor ?? _defaults.HeaderIconTextColor,
            BannerTextColor: data?.BannerTextColor ?? _defaults.BannerTextColor,
            PageTitleColor: data?.PageTitleColor ?? _defaults.PageTitleColor,
            ProductCardCategoryColor: data?.ProductCardCategoryColor ?? _defaults.ProductCardCategoryColor,
            ProductCardNameColor: data?.ProductCardNameColor ?? _defaults.ProductCardNameColor,
            ProductCardQuantityColor: data?.ProductCardQuantityColor ?? _defaults.ProductCardQuantityColor,
            ProductCardTotalColor: data?.ProductCardTotalColor ?? _defaults.ProductCardTotalColor,
            ProductCardPriceColor: data?.ProductCardPriceColor ?? _defaults.ProductCardPriceColor,
            ProductCardButtonColor: data?.ProductCardButtonColor ?? _defaults.ProductCardButtonColor,
            AdminSidebarTextColor: data?.AdminSidebarTextColor ?? _defaults.AdminSidebarTextColor,
            AdminPageTitleColor: data?.AdminPageTitleColor ?? _defaults.AdminPageTitleColor,
            FooterTextColor: data?.FooterTextColor ?? _defaults.FooterTextColor,
            // fonts
            StoreNameFont: data?.StoreNameFont ?? _defaults.StoreNameFont,
            AvatarTextFont: data?.AvatarTextFont ?? _defaults.AvatarTextFont,
            HeaderIconTextFont: data?.HeaderIconTextFont ?? _defaults.HeaderIconTextFont,
            NavbarMenuTextFont: data?.NavbarMenuTextFont ?? _defaults.NavbarMenuTextFont,
            BannerTextFont: data?.BannerTextFont ?? _defaults.BannerTextFont,
            PageTitleFont: data?.PageTitleFont ?? _defaults.PageTitleFont,
            ProductCardCategoryFont: data?.ProductCardCategoryFont ?? _defaults.ProductCardCategoryFont,
            ProductCardNameFont: data?.ProductCardNameFont ?? _defaults.ProductCardNameFont,
            ProductCardQuantityFont: data?.ProductCardQuantityFont ?? _defaults.ProductCardQuantityFont,
            ProductCardTotalFont: data?.ProductCardTotalFont ?? _defaults.ProductCardTotalFont,
            ProductCardPriceFont: data?.ProductCardPriceFont ?? _defaults.ProductCardPriceFont,
            ProductCardButtonFont: data?.ProductCardButtonFont ?? _defaults.ProductCardButtonFont,
            AdminSidebarTextFont: data?.AdminSidebarTextFont ?? _defaults.AdminSidebarTextFont,
            AdminPageTitleFont: data?.AdminPageTitleFont ?? _defaults.AdminPageTitleFont,
            FooterTextFont: data?.FooterTextFont ?? _defaults.FooterTextFont,
            HeroCarousel: MapCarousel(data?.HeroCarousel),
            HomepageSections: MapSections(data?.HomepageSections),
            Footer: MapFooter(data?.Footer),
            Translations: data?.Translations
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
                ButtonVisible: s.ButtonVisible ?? true,
                Translations: s.Translations
            )).ToList() ?? _defaultCarousel.Slides
        );
    }

    private List<HomepageSectionDto> MapSections(List<SectionData>? sections)
    {
        if (sections is null) return _defaultSections;

        var mapped = sections.Select(sec => new HomepageSectionDto(
            Id: sec.Id ?? Guid.NewGuid().ToString(),
            Title: sec.Title ?? string.Empty,
            ShowTitle: sec.ShowTitle ?? false,
            Layout: sec.Layout ?? "grid",
            Columns: sec.Columns ?? 3,
            BackgroundColor: sec.BackgroundColor ?? "transparent",
            PaddingY: sec.PaddingY ?? 48,
            Order: sec.Order ?? 0,
            Enabled: sec.Enabled ?? true,
            Cards: sec.Cards?.Select(c => new SectionCardDto(
                Id: c.Id ?? Guid.NewGuid().ToString(),
                ImageBase64: c.ImageBase64,
                ImageUrl: c.ImageUrl,
                Title: c.Title ?? string.Empty,
                Subtitle: c.Subtitle ?? string.Empty,
                Description: c.Description ?? string.Empty,
                TextPosition: c.TextPosition ?? "center",
                TextColor: c.TextColor ?? "#FFFFFF",
                OverlayColor: c.OverlayColor ?? "#000000",
                OverlayOpacity: c.OverlayOpacity ?? 0,
                BadgeText: c.BadgeText,
                BadgeColor: c.BadgeColor,
                BadgePosition: c.BadgePosition ?? "top-left",
                LinkType: c.LinkType ?? "none",
                LinkTarget: c.LinkTarget,
                ButtonText: c.ButtonText,
                ButtonVisible: c.ButtonVisible ?? false,
                AspectRatio: c.AspectRatio ?? "landscape",
                ColSpan: c.ColSpan ?? 1,
                RowSpan: c.RowSpan ?? 1,
                Translations: c.Translations
            )).ToList() ?? [],
            Translations: sec.Translations
        )).ToList() ?? _defaultSections;

        return mapped;
    }

    private FooterSettingsDto MapFooter(FooterData? f)
    {
        if (f is null) return _defaultFooter;

        return new FooterSettingsDto(
            Columns: f.Columns?.Select(col => new FooterColumnDto(
                Id: col.Id ?? Guid.NewGuid().ToString(),
                Type: col.Type ?? "links",
                Title: col.Title ?? string.Empty,
                Order: col.Order ?? 0,
                Enabled: col.Enabled ?? true,
                Links: col.Links?.Select(l => new FooterLinkDto(
                    Id: l.Id ?? Guid.NewGuid().ToString(),
                    Label: l.Label ?? string.Empty,
                    Url: l.Url ?? "#",
                    Order: l.Order ?? 0,
                    Translations: l.Translations
                )).ToList(),
                Address: col.Address,
                Phone: col.Phone,
                Email: col.Email,
                SocialLinks: col.SocialLinks?.Select(sl => new FooterSocialLinkDto(
                    Id: sl.Id ?? Guid.NewGuid().ToString(),
                    Platform: sl.Platform ?? "instagram",
                    Url: sl.Url ?? "#"
                )).ToList(),
                FollowText: col.FollowText,
                ShowLogo: col.ShowLogo,
                Description: col.Description,
                Translations: col.Translations
            )).ToList() ?? _defaultFooter.Columns,
            BackgroundColor: f.BackgroundColor,
            TextColor: f.TextColor,
            CopyrightText: f.CopyrightText ?? _defaultFooter.CopyrightText,
            BottomBarAlignment: f.BottomBarAlignment ?? _defaultFooter.BottomBarAlignment,
            BottomLinks: f.BottomLinks?.Select(bl => new FooterBottomLinkDto(
                Id: bl.Id ?? Guid.NewGuid().ToString(),
                Label: bl.Label ?? string.Empty,
                Url: bl.Url ?? "#",
                Order: bl.Order ?? 0,
                Translations: bl.Translations
            )).ToList() ?? _defaultFooter.BottomLinks
        );
    }

    private static SettingsData? TryDeserialize(string json)
    {
        try { return JsonSerializer.Deserialize<SettingsData>(json, _jsonOptions); }
        catch { return null; }
    }

    private static readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web);
}

// Internal data structures matching the JSON blob in the database
public record SettingsData(
    string? StoreName,
    bool? ShowStoreNameInHeader,
    string? PrimaryColor,
    string? HeaderBackgroundColor,
    string? BannerBackgroundColor,
    string? BackgroundColor,
    string? AdminSidebarBackgroundColor,
    string? AdminPageBackgroundColor,
    string? FreeShippingBannerText,
    bool? FreeShippingBannerVisible,
    bool? FreeShippingBannerMarquee,
    int? FreeShippingBannerMarqueeSpeed,
    string? BackgroundPatternBase64,
    int? BackgroundPatternOpacity,
    string? NavbarActiveColor,
    string? NavbarMenuTextColor,
    string? StoreNameColor,
    string? AvatarTextColor,
    string? HeaderIconTextColor,
    string? BannerTextColor,
    string? PageTitleColor,
    string? ProductCardCategoryColor,
    string? ProductCardNameColor,
    string? ProductCardQuantityColor,
    string? ProductCardTotalColor,
    string? ProductCardPriceColor,
    string? ProductCardButtonColor,
    string? AdminSidebarTextColor,
    string? AdminPageTitleColor,
    string? FooterTextColor,
    string? StoreNameFont,
    string? AvatarTextFont,
    string? HeaderIconTextFont,
    string? NavbarMenuTextFont,
    string? BannerTextFont,
    string? PageTitleFont,
    string? ProductCardCategoryFont,
    string? ProductCardNameFont,
    string? ProductCardQuantityFont,
    string? ProductCardTotalFont,
    string? ProductCardPriceFont,
    string? ProductCardButtonFont,
    string? AdminSidebarTextFont,
    string? AdminPageTitleFont,
    string? FooterTextFont,
    CarouselData? HeroCarousel,
    List<SectionData>? HomepageSections,
    FooterData? Footer,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record CarouselData(
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

public record SlideData(
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
    bool? ButtonVisible,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record SectionData(
    string? Id,
    string? Title,
    bool? ShowTitle,
    string? Layout,
    int? Columns,
    string? BackgroundColor,
    int? PaddingY,
    int? Order,
    bool? Enabled,
    List<CardData>? Cards,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record CardData(
    string? Id,
    string? ImageBase64,
    string? ImageUrl,
    string? Title,
    string? Subtitle,
    string? Description,
    string? TextPosition,
    string? TextColor,
    string? OverlayColor,
    int? OverlayOpacity,
    string? BadgeText,
    string? BadgeColor,
    string? BadgePosition,
    string? LinkType,
    string? LinkTarget,
    string? ButtonText,
    bool? ButtonVisible,
    string? AspectRatio,
    int? ColSpan,
    int? RowSpan,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record FooterData(
    List<FooterColumnData>? Columns,
    string? BackgroundColor,
    string? TextColor,
    string? CopyrightText,
    string? BottomBarAlignment,
    List<FooterBottomLinkData>? BottomLinks
);

public record FooterColumnData(
    string? Id,
    string? Type,
    string? Title,
    int? Order,
    bool? Enabled,
    List<FooterLinkData>? Links,
    string? Address,
    string? Phone,
    string? Email,
    List<FooterSocialLinkData>? SocialLinks,
    string? FollowText,
    bool? ShowLogo,
    string? Description,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record FooterLinkData(
    string? Id,
    string? Label,
    string? Url,
    int? Order,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);

public record FooterSocialLinkData(
    string? Id,
    string? Platform,
    string? Url
);

public record FooterBottomLinkData(
    string? Id,
    string? Label,
    string? Url,
    int? Order,
    [property: JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations
);
