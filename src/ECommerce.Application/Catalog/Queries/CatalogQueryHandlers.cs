using ECommerce.Application.Catalog.Specifications;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Identity;
using MediatR;
using System.Linq;

namespace ECommerce.Application.Catalog.Queries;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IProductRepository _products;
    private readonly IUserRepository _users;

    public GetProductsHandler(IProductRepository products, IUserRepository users)
    {
        _products = products;
        _users = users;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery q, CancellationToken ct)
    {
        var spec = new ProductsWithFiltersSpecification(
            q.Search, q.MinPrice, q.MaxPrice, q.CategoryId, q.SortBy, q.Descending, q.Page, q.PageSize, q.IncludeInactive, q.IncludeDeleted);
            
        var count = await _products.CountAsync(spec, ct);
        var products = await _products.ListAsync(spec, ct);

        // Map User IDs to Names
        var users = await _users.GetAllAsync(ct);
        var userMap = users.ToDictionary(u => u.Id.ToString(), u => u.FullName);

        var items = products.Select(p => new ProductDto(
            p.Id, p.Name, p.Description, p.ImageUrl,
            p.Price.Amount, p.Price.Currency, p.Stock.Value, p.IsActive,
            p.CategoryId, p.Category?.Name,
            p.CreatedAt, p.CreatedBy != null && userMap.TryGetValue(p.CreatedBy, out var cb) ? cb : p.CreatedBy,
            p.UpdatedAt, p.UpdatedBy != null && userMap.TryGetValue(p.UpdatedBy, out var ub) ? ub : p.UpdatedBy,
            p.DeletedAt, p.IsDeleted)).ToList();
            
        return new PagedResult<ProductDto>(items, count, q.Page, q.PageSize);
    }
}

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _products;
    private readonly IUserRepository _users;

    public GetProductByIdHandler(IProductRepository products, IUserRepository users)
    {
        _products = products;
        _users = users;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery q, CancellationToken ct)
    {
        var p = await _products.GetByIdAsync(q.Id, ct);
        if (p is null) return null;

        var userMap = (await _users.GetAllAsync(ct)).ToDictionary(u => u.Id.ToString(), u => u.FullName);

        return new ProductDto(p.Id, p.Name, p.Description, p.ImageUrl,
            p.Price.Amount, p.Price.Currency, p.Stock.Value, p.IsActive,
            p.CategoryId, p.Category?.Name,
            p.CreatedAt, p.CreatedBy != null && userMap.TryGetValue(p.CreatedBy, out var cb) ? cb : p.CreatedBy,
            p.UpdatedAt, p.UpdatedBy != null && userMap.TryGetValue(p.UpdatedBy, out var ub) ? ub : p.UpdatedBy,
            p.DeletedAt, p.IsDeleted);
    }
}

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    private readonly ICategoryRepository _categories;
    private readonly IUserRepository _users;

    public GetCategoriesHandler(ICategoryRepository categories, IUserRepository users)
    {
        _categories = categories;
        _users = users;
    }

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery q, CancellationToken ct)
    {
        var categories = await _categories.GetAllAsync(q.IncludeDeleted, ct);
        var userMap = (await _users.GetAllAsync(ct)).ToDictionary(u => u.Id.ToString(), u => u.FullName);

        return categories.Select(c => new CategoryDto(
            c.Id, c.Name, c.Description, c.ImageUrl, c.IsActive, c.ParentCategoryId, c.ParentCategory?.Name,
            c.CreatedAt, c.CreatedBy != null && userMap.TryGetValue(c.CreatedBy, out var cb) ? cb : c.CreatedBy,
            c.UpdatedAt, c.UpdatedBy != null && userMap.TryGetValue(c.UpdatedBy, out var ub) ? ub : c.UpdatedBy,
            c.DeletedAt, c.IsDeleted)).ToList();
    }
}
