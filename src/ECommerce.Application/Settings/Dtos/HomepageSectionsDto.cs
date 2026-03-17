namespace ECommerce.Application.Settings.Dtos;

public record SectionCardDto(
    string Id,
    string? ImageBase64,
    string? ImageUrl,
    string Title,
    string Subtitle,
    string Description,
    string TextPosition,       // "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    string TextColor,
    string OverlayColor,
    int OverlayOpacity,        // 0-100
    string? BadgeText,
    string? BadgeColor,
    string BadgePosition,      // "top-left" | "top-right"
    string LinkType,           // "product" | "category" | "url" | "none"
    string? LinkTarget,
    string? ButtonText,
    bool ButtonVisible,
    string AspectRatio,        // "square" | "landscape" | "portrait" | "auto"
    int ColSpan,               // for collage layout; default 1
    int RowSpan                // for collage layout; default 1
);

public record HomepageSectionDto(
    string Id,
    string Title,
    bool ShowTitle,
    string Layout,             // "grid" | "featured" | "banner" | "carousel" | "masonry" | "clover" | "collage"
    int Columns,               // 2, 3, or 4 (grid/masonry)
    string BackgroundColor,    // hex or "transparent"
    int PaddingY,              // px
    int Order,
    bool Enabled,
    List<SectionCardDto> Cards
);

public record HomepageSectionsDto(
    List<HomepageSectionDto> Sections
);
