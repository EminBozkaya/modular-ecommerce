using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

public class Product : BaseAuditableEntity
{
    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public Money Price { get; private set; } = default!;
    public StockQuantity Stock { get; private set; } = default!;
    public bool IsActive { get; private set; }

    public Guid CategoryId { get; private set; }
    public Category? Category { get; private set; }

    public Guid UnitId { get; private set; }
    public Unit? Unit { get; private set; }

    private Product() { }

    public static Product Create(string name, string? description, string? imageUrl, Money price, StockQuantity stock, Guid categoryId, Guid unitId, bool isActive = true)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new Product
        {
            Name = name,
            Description = description,
            ImageUrl = imageUrl,
            Price = price,
            Stock = stock,
            CategoryId = categoryId,
            UnitId = unitId,
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void UpdateDetails(string name, string? description, string? imageUrl, Money price, Guid categoryId, Guid unitId, bool isActive)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        Price = price;
        CategoryId = categoryId;
        UnitId = unitId;
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(decimal quantity)
    {
        Stock = new StockQuantity(quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void DecreaseStock(decimal amount)
    {
        Stock = Stock.Decrease(amount);
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

    public void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
