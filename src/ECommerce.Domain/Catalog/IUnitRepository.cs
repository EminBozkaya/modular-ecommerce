using ECommerce.Domain.Catalog.Entities;

namespace ECommerce.Domain.Catalog;

public interface IUnitRepository
{
    Task<Unit?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Unit>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Unit unit, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
