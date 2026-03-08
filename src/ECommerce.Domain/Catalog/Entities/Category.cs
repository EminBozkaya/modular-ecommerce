using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

public class Category : BaseAuditableEntity
{
    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; }

    private readonly List<Product> _products = [];
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private Category() { }

    public static Category Create(string name, string? description = null, string? imageUrl = null, bool isActive = true)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new Category
        {
            Name = name,
            Description = description,
            ImageUrl = imageUrl,
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? description, string? imageUrl, bool isActive)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
    public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }

    public void SoftDelete()
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
        IsActive = false;
    }
}
