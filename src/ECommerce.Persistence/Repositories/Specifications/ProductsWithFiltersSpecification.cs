using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories.Specifications;

internal class ProductsWithFiltersSpecification : BaseSpecification<Product>
{
    public ProductsWithFiltersSpecification(ProductFilterCriteria c)
        : base(x =>
            (string.IsNullOrEmpty(c.SearchTerm) ||
             EF.Functions.ILike(x.Name, $"%{c.SearchTerm}%") ||
             EF.Functions.ILike(x.Name, $"%{c.SearchTerm.Replace('ı', 'i').Replace('İ', 'i').Replace('I', 'i')}%") ||
             (x.Description != null && (
                EF.Functions.ILike(x.Description, $"%{c.SearchTerm}%") ||
                EF.Functions.ILike(x.Description, $"%{c.SearchTerm.Replace('ı', 'i').Replace('İ', 'i').Replace('I', 'i')}%")
             )) ||
             x.Translations.Any(t =>
                t.LanguageCode == c.Language &&
                (EF.Functions.ILike(t.Name, $"%{c.SearchTerm}%") ||
                 (t.Description != null && EF.Functions.ILike(t.Description, $"%{c.SearchTerm}%"))))) &&
            (!c.MinPrice.HasValue || x.Price.Amount >= c.MinPrice.Value) &&
            (!c.MaxPrice.HasValue || x.Price.Amount <= c.MaxPrice.Value) &&
            (!c.CategoryId.HasValue || x.CategoryId == c.CategoryId.Value) &&
            (c.IncludeInactive || x.IsActive)
        )
    {
        if (c.IncludeDeleted) ApplyIgnoreQueryFilters();
        AddInclude(x => x.Translations);
        AddInclude("Category.Translations");
        AddInclude("Unit.Translations");

        if (!string.IsNullOrEmpty(c.SortBy))
        {
            switch (c.SortBy.ToLower())
            {
                case "price":
                    if (c.Descending) ApplyOrderByDescending(p => p.Price.Amount);
                    else ApplyOrderBy(p => p.Price.Amount);
                    break;
                case "name":
                    if (c.Descending) ApplyOrderByDescending(p => p.Name);
                    else ApplyOrderBy(p => p.Name);
                    break;
                default:
                    ApplyOrderBy(p => p.Name);
                    break;
            }
        }
        else
        {
            ApplyOrderBy(p => p.Name);
        }

        ApplyPaging((c.PageNumber - 1) * c.PageSize, c.PageSize);
    }
}
