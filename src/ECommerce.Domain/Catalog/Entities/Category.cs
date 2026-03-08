using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

public class Category : BaseAuditableEntity
{
    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; }

    public Guid? ParentCategoryId { get; private set; }
    public Category? ParentCategory { get; private set; }

    private readonly List<Category> _subCategories = [];
    public IReadOnlyCollection<Category> SubCategories => _subCategories.AsReadOnly();

    private readonly List<Product> _products = [];
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private Category() { }

    public static Category Create(string name, string? description = null, string? imageUrl = null, bool isActive = true, Guid? parentCategoryId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new Category
        {
            Name = name,
            Description = description,
            ImageUrl = imageUrl,
            IsActive = isActive,
            ParentCategoryId = parentCategoryId,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? description, string? imageUrl, bool isActive, Guid? parentCategoryId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        IsActive = isActive;
        ParentCategoryId = parentCategoryId;
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
