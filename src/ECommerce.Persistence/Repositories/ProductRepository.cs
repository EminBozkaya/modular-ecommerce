using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Common.Specifications;
using ECommerce.Persistence.Context;
using ECommerce.Persistence.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _ctx;

    public ProductRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Products.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<Product>> GetAllActiveAsync(CancellationToken ct = default)
        => await _ctx.Products.AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default)
        => await _ctx.Products.AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.CategoryId == categoryId)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Product>> ListAsync(ISpecification<Product> spec, CancellationToken ct = default)
    {
        return await SpecificationEvaluator<Product>.GetQuery(_ctx.Products.AsNoTracking(), spec).ToListAsync(ct);
    }

    public async Task<int> CountAsync(ISpecification<Product> spec, CancellationToken ct = default)
    {
        return await SpecificationEvaluator<Product>.GetQuery(_ctx.Products.AsNoTracking(), spec).CountAsync(ct);
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
        => await _ctx.Products.AddAsync(product, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
