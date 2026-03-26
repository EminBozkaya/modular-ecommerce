using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;

namespace ECommerce.Domain.Catalog;

/// <summary>
/// Filter criteria for product search — infrastructure-agnostic (no EF Core dependency).
/// </summary>
public record ProductFilterCriteria(
    string? SearchTerm,
    decimal? MinPrice,
    decimal? MaxPrice,
    Guid? CategoryId,
    string? SortBy,
    bool Descending,
    int PageNumber,
    int PageSize,
    bool IncludeInactive = false,
    bool IncludeDeleted = false,
    string Language = "tr");

/// <summary>
/// Aggregate repository for the Product aggregate root.
/// </summary>
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Product?> GetByIdAsNoTrackingAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> GetAllActiveAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> ListAsync(ISpecification<Product> spec, CancellationToken ct = default);
    Task<int> CountAsync(ISpecification<Product> spec, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> SearchAsync(ProductFilterCriteria criteria, CancellationToken ct = default);
    Task<int> SearchCountAsync(ProductFilterCriteria criteria, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
