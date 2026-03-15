using ECommerce.Domain.Identity.Entities;

namespace ECommerce.Domain.Identity;

/// <summary>
/// Aggregate repository for UserAddress — scoped to the owning user.
/// </summary>
public interface IUserAddressRepository
{
    /// <summary>Returns addresses as read-only (AsNoTracking).</summary>
    Task<IReadOnlyList<UserAddress>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    /// <summary>Returns tracked addresses for mutation operations.</summary>
    Task<List<UserAddress>> GetByUserIdTrackedAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<UserAddress>> GetAllAsync(bool includeDeleted = false, CancellationToken ct = default);
    Task<UserAddress?> GetByIdAsync(Guid id, bool includeDeleted = false, CancellationToken ct = default);
    Task AddAsync(UserAddress address, CancellationToken ct = default);
    void Remove(UserAddress address);
    Task SaveChangesAsync(CancellationToken ct = default);
}
