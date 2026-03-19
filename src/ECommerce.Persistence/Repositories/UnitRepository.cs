using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class UnitRepository : IUnitRepository
{
    private readonly ApplicationDbContext _context;

    public UnitRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Units
            .Include(u => u.Translations)
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public async Task<IReadOnlyList<Unit>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Units
            .Include(u => u.Translations)
            .OrderBy(u => u.Name)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Unit unit, CancellationToken ct = default)
    {
        await _context.Units.AddAsync(unit, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
