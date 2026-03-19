using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

/// <summary>
/// Translation of a Unit's display name for a specific language.
/// ALL languages including the deployment's DefaultLanguage are stored here.
/// Unit.Name serves as the canonical internal identifier only.
/// Unique constraint: (UnitId, LanguageCode).
/// </summary>
public class UnitTranslation : BaseAuditableEntity
{
    public Guid UnitId { get; private set; }
    public Unit? Unit { get; private set; }

    /// <summary>Language code (e.g. "tr", "en", "de"). Includes the deployment's DefaultLanguage.</summary>
    public string LanguageCode { get; private set; } = default!;

    public string Name { get; private set; } = default!;

    private UnitTranslation() { }

    public static UnitTranslation Create(Guid unitId, string languageCode, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(languageCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new UnitTranslation
        {
            UnitId = unitId,
            LanguageCode = languageCode.ToLowerInvariant(),
            Name = name,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}
