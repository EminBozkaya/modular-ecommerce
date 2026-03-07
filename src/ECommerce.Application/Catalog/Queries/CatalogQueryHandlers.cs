using ECommerce.Application.Catalog.Specifications;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using MediatR;

namespace ECommerce.Application.Catalog.Queries;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IProductRepository _products;
    public GetProductsHandler(IProductRepository products) => _products = products;

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery q, CancellationToken ct)
    {
        var spec = new ProductsWithFiltersSpecification(
            q.SearchTerm, q.MinPrice, q.MaxPrice, q.CategoryId, q.SortBy, q.Descending, q.PageNumber, q.PageSize);
            
        var count = await _products.CountAsync(spec, ct);
        var products = await _products.ListAsync(spec, ct);

        var items = products.Select(p => new ProductDto(
            p.Id, p.Name, p.Description, p.ImageUrl,
            p.Price.Amount, p.Price.Currency, p.Stock.Value, p.IsActive,
            p.CategoryId, p.Category!.Name)).ToList();
            
        return new PagedResult<ProductDto>(items, count, q.PageNumber, q.PageSize);
    }
}

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _products;
    public GetProductByIdHandler(IProductRepository products) => _products = products;

    public async Task<ProductDto?> Handle(GetProductByIdQuery q, CancellationToken ct)
    {
        var products = await _products.GetAllActiveAsync(ct);
        var p = products.FirstOrDefault(x => x.Id == q.Id);
        if (p is null) return null;
        return new ProductDto(p.Id, p.Name, p.Description, p.ImageUrl,
            p.Price.Amount, p.Price.Currency, p.Stock.Value, p.IsActive,
            p.CategoryId, p.Category!.Name);
    }
}

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    private readonly ICategoryRepository _categories;
    public GetCategoriesHandler(ICategoryRepository categories) => _categories = categories;

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery q, CancellationToken ct)
    {
        var categories = await _categories.GetAllAsync(ct);
        return categories.Select(c => new CategoryDto(c.Id, c.Name, c.Description, c.ImageUrl)).ToList();
    }
}
