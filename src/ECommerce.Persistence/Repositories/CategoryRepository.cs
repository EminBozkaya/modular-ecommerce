using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _ctx;

    public CategoryRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Categories.Include(c => c.ParentCategory).Where(c => !c.IsDeleted).AsNoTracking().ToListAsync(ct);

    public async Task AddAsync(Category category, CancellationToken ct = default)
        => await _ctx.Categories.AddAsync(category, ct);

    public void Update(Category category)
        => _ctx.Categories.Update(category);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}
