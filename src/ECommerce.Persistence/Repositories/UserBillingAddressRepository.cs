using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class UserBillingAddressRepository : IUserBillingAddressRepository
{
    private readonly ApplicationDbContext _db;
    public UserBillingAddressRepository(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<UserBillingAddress>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _db.UserBillingAddresses
            .AsNoTracking()
            .Include(a => a.DistrictRef)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

    public async Task<List<UserBillingAddress>> GetByUserIdTrackedAsync(Guid userId, CancellationToken ct = default)
        => await _db.UserBillingAddresses
            .Include(a => a.DistrictRef)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<UserBillingAddress>> GetAllAsync(bool includeDeleted = false, CancellationToken ct = default)
    {
        var query = includeDeleted ? _db.UserBillingAddresses.IgnoreQueryFilters() : _db.UserBillingAddresses;
        return await query.AsNoTracking()
            .Include(a => a.User)
            .Include(a => a.DistrictRef)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<UserBillingAddress?> GetByIdAsync(Guid id, bool includeDeleted = false, CancellationToken ct = default)
    {
        var query = includeDeleted ? _db.UserBillingAddresses.IgnoreQueryFilters() : _db.UserBillingAddresses;
        return await query.Include(a => a.User).Include(a => a.DistrictRef).FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    public async Task AddAsync(UserBillingAddress address, CancellationToken ct = default)
        => await _db.UserBillingAddresses.AddAsync(address, ct);

    public void Remove(UserBillingAddress address)
        => _db.UserBillingAddresses.Remove(address);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
}
