using ECommerce.Application.Common.Caching;
using ECommerce.Application.Common.Models;
using MediatR;

namespace ECommerce.Application.Catalog.Queries;

// --- DTOs ---
public record ProductDto(
    Guid Id, string Name, string? Description, string? ImageUrl,
    decimal PriceAmount, string PriceCurrency,
    int StockQuantity, bool IsActive,
    Guid CategoryId, string? CategoryName);

public record CategoryDto(Guid Id, string Name, string? Description, string? ImageUrl);

// --- Queries ---
public record GetProductsQuery(
    string? SearchTerm = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    Guid? CategoryId = null,
    int PageNumber = 1,
    int PageSize = 10,
    string? SortBy = null,
    bool Descending = false) : IRequest<PagedResult<ProductDto>>, ICacheableQuery
{
    public string CacheKey => $"catalog:products:page:{PageNumber}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;
public record GetCategoriesQuery : IRequest<IReadOnlyList<CategoryDto>>;
