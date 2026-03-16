using ECommerce.Application.Catalog.Specifications;
using ECommerce.Application.Common.Models;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Identity;
using MediatR;

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
            q.Search, q.MinPrice, q.MaxPrice, q.CategoryId, q.SortBy, q.Descending, q.Page, q.PageSize, q.IncludeInactive, q.IncludeDeleted, q.Language);

        var count = await _products.CountAsync(spec, ct);
        var products = await _products.ListAsync(spec, ct);

        var users = await _users.GetAllWithDeletedAsync(ct);
        var userMap = users.ToDictionary(u => u.Id.ToString(), u => u.FullName, StringComparer.OrdinalIgnoreCase);

        var items = products.Select(p =>
        {
            var t = p.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);
            var catT = p.Category?.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);
            return new ProductDto(
                p.Id,
                t?.Name ?? p.Name,
                t?.Description ?? p.Description,
                p.ImageUrl,
                p.Price.Amount, p.Price.Currency.ToString(), p.Stock.Value, p.IsActive,
                p.CategoryId, catT?.Name ?? p.Category?.Name,
                p.UnitId, p.Unit?.Name,
                p.CreatedAt, !string.IsNullOrEmpty(p.CreatedBy) && userMap.TryGetValue(p.CreatedBy, out var cb) ? cb : p.CreatedBy,
                p.UpdatedAt, !string.IsNullOrEmpty(p.UpdatedBy) && userMap.TryGetValue(p.UpdatedBy, out var ub) ? ub : p.UpdatedBy,
                p.DeletedAt, p.IsDeleted);
        }).ToList();

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

        var userMap = (await _users.GetAllWithDeletedAsync(ct)).ToDictionary(u => u.Id.ToString(), u => u.FullName, StringComparer.OrdinalIgnoreCase);
        var t = p.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);
        var catT = p.Category?.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);

        return new ProductDto(
            p.Id,
            t?.Name ?? p.Name,
            t?.Description ?? p.Description,
            p.ImageUrl,
            p.Price.Amount, p.Price.Currency.ToString(), p.Stock.Value, p.IsActive,
            p.CategoryId, catT?.Name ?? p.Category?.Name,
            p.UnitId, p.Unit?.Name,
            p.CreatedAt, !string.IsNullOrEmpty(p.CreatedBy) && userMap.TryGetValue(p.CreatedBy, out var cb) ? cb : p.CreatedBy,
            p.UpdatedAt, !string.IsNullOrEmpty(p.UpdatedBy) && userMap.TryGetValue(p.UpdatedBy, out var ub) ? ub : p.UpdatedBy,
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
        var categories = await _categories.GetAllAsync(q.IncludeDeleted, q.OnlyMain, ct);
        var userMap = (await _users.GetAllWithDeletedAsync(ct)).ToDictionary(u => u.Id.ToString(), u => u.FullName, StringComparer.OrdinalIgnoreCase);

        return categories.Select(c =>
        {
            var t = c.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);
            var parentT = c.ParentCategory?.Translations.FirstOrDefault(x => x.LanguageCode == q.Language);
            return new CategoryDto(
                c.Id,
                t?.Name ?? c.Name,
                t?.Description ?? c.Description,
                c.ImageUrl, c.IsActive, c.ParentCategoryId,
                parentT?.Name ?? c.ParentCategory?.Name,
                c.CreatedAt, !string.IsNullOrEmpty(c.CreatedBy) && userMap.TryGetValue(c.CreatedBy, out var cb) ? cb : c.CreatedBy,
                c.UpdatedAt, !string.IsNullOrEmpty(c.UpdatedBy) && userMap.TryGetValue(c.UpdatedBy, out var ub) ? ub : c.UpdatedBy,
                c.DeletedAt, c.IsDeleted);
        }).ToList();
    }
}

public class GetUnitsHandler : IRequestHandler<GetUnitsQuery, IReadOnlyList<UnitDto>>
{
    private readonly IUnitRepository _units;

    public GetUnitsHandler(IUnitRepository units)
    {
        _units = units;
    }

    public async Task<IReadOnlyList<UnitDto>> Handle(GetUnitsQuery q, CancellationToken ct)
    {
        var units = await _units.GetAllAsync(ct);
        return units.Select(u => new UnitDto(u.Id, u.Name, u.Code)).ToList();
    }
}

public class GetProductTranslationsHandler : IRequestHandler<GetProductTranslationsQuery, IReadOnlyList<TranslationDto>>
{
    private readonly IProductRepository _products;

    public GetProductTranslationsHandler(IProductRepository products)
    {
        _products = products;
    }

    public async Task<IReadOnlyList<TranslationDto>> Handle(GetProductTranslationsQuery q, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(q.ProductId, ct)
            ?? throw new KeyNotFoundException($"Product {q.ProductId} not found.");
        return product.Translations
            .Select(t => new TranslationDto(t.LanguageCode, t.Name, t.Description))
            .ToList();
    }
}

public class GetCategoryTranslationsHandler : IRequestHandler<GetCategoryTranslationsQuery, IReadOnlyList<TranslationDto>>
{
    private readonly ICategoryRepository _categories;

    public GetCategoryTranslationsHandler(ICategoryRepository categories)
    {
        _categories = categories;
    }

    public async Task<IReadOnlyList<TranslationDto>> Handle(GetCategoryTranslationsQuery q, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(q.CategoryId, ct)
            ?? throw new KeyNotFoundException($"Category {q.CategoryId} not found.");
        return category.Translations
            .Select(t => new TranslationDto(t.LanguageCode, t.Name, t.Description))
            .ToList();
    }
}
