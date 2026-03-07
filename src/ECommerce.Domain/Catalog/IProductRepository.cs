using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;

namespace ECommerce.Domain.Catalog;

/// <summary>
/// Aggregate repository for the Product aggregate root.
/// </summary>
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> GetAllActiveAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> ListAsync(ISpecification<Product> spec, CancellationToken ct = default);
    Task<int> CountAsync(ISpecification<Product> spec, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
