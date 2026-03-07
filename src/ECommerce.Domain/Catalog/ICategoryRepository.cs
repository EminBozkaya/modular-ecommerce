using ECommerce.Domain.Catalog.Entities;

namespace ECommerce.Domain.Catalog;

/// <summary>
/// Aggregate repository for the Category aggregate root.
/// </summary>
public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Category category, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
