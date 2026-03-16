using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

/// <summary>
/// Translation of Category's localizable text fields for a specific language.
/// Created only for non-default languages — the default language lives on Category.Name/Description.
/// Unique constraint: (CategoryId, LanguageCode).
/// </summary>
public class CategoryTranslation : BaseAuditableEntity
{
    public Guid CategoryId { get; private set; }
    public Category? Category { get; private set; }

    /// <summary>Language code (e.g. "en", "de"). Never the deployment's DefaultLanguage.</summary>
    public string LanguageCode { get; private set; } = default!;

    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }

    private CategoryTranslation() { }

    public static CategoryTranslation Create(Guid categoryId, string languageCode, string name, string? description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(languageCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new CategoryTranslation
        {
            CategoryId = categoryId,
            LanguageCode = languageCode.ToLowerInvariant(),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }
}
