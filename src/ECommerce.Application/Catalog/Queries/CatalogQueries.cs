using ECommerce.Application.Common.Caching;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Catalog.Queries;

// --- DTOs ---
public record ProductDto(
    Guid Id, string Name, string? Description, string? ImageUrl,
    decimal PriceAmount, string PriceCurrency,
    int StockQuantity, bool IsActive,
    Guid CategoryId, string? CategoryName,
    DateTime CreatedAt, string? CreatedBy,
    DateTime? UpdatedAt, string? UpdatedBy,
    DateTime? DeletedAt, bool IsDeleted);

public record CategoryDto(
    Guid Id, string Name, string? Description, string? ImageUrl,
    bool IsActive, Guid? ParentCategoryId = null, string? ParentCategoryName = null,
    DateTime? CreatedAt = null, string? CreatedBy = null,
    DateTime? UpdatedAt = null, string? UpdatedBy = null,
    DateTime? DeletedAt = null, bool IsDeleted = false);

// --- Queries ---
public record GetProductsQuery(
    string? Search = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    Guid? CategoryId = null,
    int Page = 1,
    int PageSize = 10,
    string? SortBy = null,
    bool Descending = false,
    bool IncludeInactive = false,
    bool IncludeDeleted = false) : IRequest<PagedResult<ProductDto>>, ICacheableQuery
{
    public string CacheKey => $"catalog:products:page:{Page}:size:{PageSize}:cat:{CategoryId}:search:{Search}:active:{!IncludeInactive}:deleted:{IncludeDeleted}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;
public record GetCategoriesQuery(bool IncludeDeleted = false) : IRequest<IReadOnlyList<CategoryDto>>;
