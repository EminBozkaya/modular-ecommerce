using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

public class Unit : BaseAuditableEntity
{
    public string Name { get; private set; } = default!;
    public string? Code { get; private set; }

    private readonly List<UnitTranslation> _translations = [];
    public IReadOnlyList<UnitTranslation> Translations => _translations.AsReadOnly();

    private Unit() { }

    public static Unit Create(string name, string? code = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new Unit
        {
            Name = name,
            Code = code,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? code = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Code = code;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Adds or updates the translation for the given language code.
    /// Safe to call multiple times — idempotent upsert.
    /// </summary>
    public void UpsertTranslation(string languageCode, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(languageCode);
        var lang = languageCode.ToLowerInvariant();
        var existing = _translations.FirstOrDefault(t => t.LanguageCode == lang);
        if (existing is not null)
            existing.Update(name);
        else
            _translations.Add(UnitTranslation.Create(Id, lang, name));
    }
}
