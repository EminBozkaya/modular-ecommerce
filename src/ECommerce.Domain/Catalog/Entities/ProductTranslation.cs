using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

/// <summary>
/// Translation of Product's localizable text fields for a specific language.
/// Created only for non-default languages — the default language lives on Product.Name/Description.
/// Unique constraint: (ProductId, LanguageCode).
/// </summary>
public class ProductTranslation : BaseAuditableEntity
{
    public Guid ProductId { get; private set; }
    public Product? Product { get; private set; }

    /// <summary>Language code (e.g. "en", "de"). Never the deployment's DefaultLanguage.</summary>
    public string LanguageCode { get; private set; } = default!;

    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }

    private ProductTranslation() { }

    public static ProductTranslation Create(Guid productId, string languageCode, string name, string? description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(languageCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new ProductTranslation
        {
            ProductId = productId,
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
