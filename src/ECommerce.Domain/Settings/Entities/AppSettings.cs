using ECommerce.Domain.Common;

namespace ECommerce.Domain.Settings.Entities;

public class AppSettings : BaseAuditableEntity
{
    /// <summary>Category name: "payment", "cargo", "auth", etc.</summary>
    public string Category { get; private set; } = default!;

    /// <summary>JSON blob stored as jsonb. Schema varies per category.</summary>
    public string Settings { get; private set; } = "{}";

    private AppSettings() { }

    public static AppSettings Create(string category, string settings)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(category);
        ArgumentNullException.ThrowIfNull(settings);
        return new AppSettings
        {
            Id = Guid.NewGuid(),
            Category = category.ToLowerInvariant(),
            Settings = settings,
            CreatedAt = DateTime.UtcNow,
        };
    }

    public void Update(string settings)
    {
        ArgumentNullException.ThrowIfNull(settings);
        Settings = settings;
        UpdatedAt = DateTime.UtcNow;
    }
}
