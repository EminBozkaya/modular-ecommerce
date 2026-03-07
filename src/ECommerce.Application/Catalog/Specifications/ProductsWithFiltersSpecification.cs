using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;

namespace ECommerce.Application.Catalog.Specifications;

public class ProductsWithFiltersSpecification : BaseSpecification<Product>
{
    public ProductsWithFiltersSpecification(string? searchTerm, decimal? minPrice, decimal? maxPrice, Guid? categoryId, string? sortBy, bool descending, int pageNumber, int pageSize)
        : base(x =>
            (string.IsNullOrEmpty(searchTerm) || x.Name.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm))) &&
            (!minPrice.HasValue || x.Price.Amount >= minPrice.Value) &&
            (!maxPrice.HasValue || x.Price.Amount <= maxPrice.Value) &&
            (!categoryId.HasValue || x.CategoryId == categoryId.Value) &&
            x.IsActive
        )
    {
        AddInclude(x => x.Category!);

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
