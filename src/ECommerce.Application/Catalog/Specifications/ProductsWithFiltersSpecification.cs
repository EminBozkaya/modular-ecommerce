using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace ECommerce.Application.Catalog.Specifications;

public class ProductsWithFiltersSpecification : BaseSpecification<Product>
{
    public ProductsWithFiltersSpecification(string? searchTerm, decimal? minPrice, decimal? maxPrice, Guid? categoryId, string? sortBy, bool descending, int pageNumber, int pageSize, bool includeInactive = false, bool includeDeleted = false, string language = "tr")
        : base(x =>
            (string.IsNullOrEmpty(searchTerm) ||
             EF.Functions.ILike(x.Name, $"%{searchTerm}%") ||
             EF.Functions.ILike(x.Name, $"%{searchTerm.Replace('ı', 'i').Replace('İ', 'i').Replace('I', 'i')}%") ||
             (x.Description != null && (
                EF.Functions.ILike(x.Description, $"%{searchTerm}%") ||
                EF.Functions.ILike(x.Description, $"%{searchTerm.Replace('ı', 'i').Replace('İ', 'i').Replace('I', 'i')}%")
             )) ||
             x.Translations.Any(t =>
                t.LanguageCode == language &&
                (EF.Functions.ILike(t.Name, $"%{searchTerm}%") ||
                 (t.Description != null && EF.Functions.ILike(t.Description, $"%{searchTerm}%"))))) &&
            (!minPrice.HasValue || x.Price.Amount >= minPrice.Value) &&
            (!maxPrice.HasValue || x.Price.Amount <= maxPrice.Value) &&
            (!categoryId.HasValue || x.CategoryId == categoryId.Value) &&
            (includeInactive || x.IsActive)
        )
    {
        if (includeDeleted) ApplyIgnoreQueryFilters();
        AddInclude(x => x.Category!);
        AddInclude(x => x.Unit!);
        AddInclude(x => x.Translations);

        if (!string.IsNullOrEmpty(sortBy))
        {
            switch (sortBy.ToLower())
            {
                case "price":
                    if (descending) ApplyOrderByDescending(p => p.Price.Amount);
                    else ApplyOrderBy(p => p.Price.Amount);
                    break;
                case "name":
                    if (descending) ApplyOrderByDescending(p => p.Name);
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

        ApplyPaging((pageNumber - 1) * pageSize, pageSize);
    }
}
