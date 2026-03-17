using ECommerce.Application.Common.Caching;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Catalog.Queries;

// --- DTOs ---
public record ProductDto(
    Guid Id, string Name, string? Description, string? ImageUrl,
    decimal PriceAmount, string PriceCurrency,
    decimal StockQuantity, bool IsActive,
    Guid CategoryId, string? CategoryName,
    Guid UnitId, string? UnitName,
    DateTime CreatedAt, string? CreatedBy,
    DateTime? UpdatedAt, string? UpdatedBy,
    DateTime? DeletedAt, bool IsDeleted);

public record CategoryDto(
    Guid Id, string Name, string? Description, string? ImageUrl,
    bool IsActive, int DisplayOrder = 0,
    Guid? ParentCategoryId = null, string? ParentCategoryName = null,
    DateTime? CreatedAt = null, string? CreatedBy = null,
    DateTime? UpdatedAt = null, string? UpdatedBy = null,
    DateTime? DeletedAt = null, bool IsDeleted = false);

public record UnitDto(Guid Id, string Name, string? Code);

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
    bool IncludeDeleted = false,
    string Language = "tr") : IRequest<PagedResult<ProductDto>>, ICacheableQuery
{
    public string CacheKey => $"catalog:products:lang:{Language}:page:{Page}:size:{PageSize}:cat:{CategoryId}:search:{Search}:active:{!IncludeInactive}:deleted:{IncludeDeleted}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
public record GetProductByIdQuery(Guid Id, string Language = "tr") : IRequest<ProductDto?>;
public record GetCategoriesQuery(bool OnlyMain = false, bool IncludeDeleted = false, string Language = "tr") : IRequest<IReadOnlyList<CategoryDto>>, ICacheableQuery
{
    public string CacheKey => $"catalog:categories:lang:{Language}:main:{OnlyMain}:deleted:{IncludeDeleted}";
    public TimeSpan? Expiration => TimeSpan.FromHours(1);
}
public record TranslationDto(string LanguageCode, string Name, string? Description);
public record GetProductTranslationsQuery(Guid ProductId) : IRequest<IReadOnlyList<TranslationDto>>;
public record GetCategoryTranslationsQuery(Guid CategoryId) : IRequest<IReadOnlyList<TranslationDto>>;

public record GetUnitsQuery() : IRequest<IReadOnlyList<UnitDto>>, ICacheableQuery
{
    public string CacheKey => "catalog:units";
    public TimeSpan? Expiration => TimeSpan.FromHours(24);
}
