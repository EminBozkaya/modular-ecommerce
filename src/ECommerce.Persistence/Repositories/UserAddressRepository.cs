using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class UserAddressRepository : IUserAddressRepository
{
    private readonly ApplicationDbContext _db;
    public UserAddressRepository(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<UserAddress>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _db.UserAddresses
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

    public async Task<List<UserAddress>> GetByUserIdTrackedAsync(Guid userId, CancellationToken ct = default)
        => await _db.UserAddresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<UserAddress>> GetAllAsync(bool includeDeleted = false, CancellationToken ct = default)
    {
        var query = includeDeleted ? _db.UserAddresses.IgnoreQueryFilters() : _db.UserAddresses;
        return await query.AsNoTracking()
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<UserAddress?> GetByIdAsync(Guid id, bool includeDeleted = false, CancellationToken ct = default)
    {
        var query = includeDeleted ? _db.UserAddresses.IgnoreQueryFilters() : _db.UserAddresses;
        return await query.Include(a => a.User).FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    public async Task AddAsync(UserAddress address, CancellationToken ct = default)
        => await _db.UserAddresses.AddAsync(address, ct);

    public void Remove(UserAddress address)
        => _db.UserAddresses.Remove(address);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
}
