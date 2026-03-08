using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;

namespace ECommerce.Domain.Catalog;

public class ProductsByCategoriesSpec : BaseSpecification<Product>
{
    public ProductsByCategoriesSpec(IEnumerable<Guid> categoryIds) 
        : base(p => categoryIds.Contains(p.CategoryId))
    {
        // Yalnızca silinmemiş olan ürünler (Entity'deki global filter halleder)
        // Verilen kategori listesinden herhangi birine ait olan ürünler
    }
}
