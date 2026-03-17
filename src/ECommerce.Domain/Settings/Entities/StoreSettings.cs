using ECommerce.Domain.Common;

namespace ECommerce.Domain.Settings.Entities;

public class StoreSettings : BaseAuditableEntity
{
    public string? ImageBase64 { get; private set; }

    /// <summary>
    /// JSON blob stored as jsonb in PostgreSQL.
    /// Contains: storeName, primaryColor, secondaryColor, navbarActiveColor,
    /// freeShippingBannerText, freeShippingBannerVisible,
    /// backgroundPatternBase64, backgroundPatternOpacity, backgroundColor.
    /// </summary>
    public string Settings { get; private set; } = "{}";

    private StoreSettings() { }

    public static StoreSettings Create(string? imageBase64, string settings)
    {
        ArgumentNullException.ThrowIfNull(settings);
        return new StoreSettings
        {
            Id = Guid.NewGuid(),
            ImageBase64 = imageBase64,
            Settings = settings,
            CreatedAt = DateTime.UtcNow,
        };
    }

    public void Update(string? imageBase64, string settings)
    {
        ArgumentNullException.ThrowIfNull(settings);
        ImageBase64 = imageBase64;
        Settings = settings;
        UpdatedAt = DateTime.UtcNow;
    }
}
