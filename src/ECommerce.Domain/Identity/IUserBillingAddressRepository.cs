using ECommerce.Domain.Identity.Entities;

namespace ECommerce.Domain.Identity;

public interface IUserBillingAddressRepository
{
    Task<IReadOnlyList<UserBillingAddress>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<List<UserBillingAddress>> GetByUserIdTrackedAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<UserBillingAddress>> GetAllAsync(bool includeDeleted = false, CancellationToken ct = default);
    Task<UserBillingAddress?> GetByIdAsync(Guid id, bool includeDeleted = false, CancellationToken ct = default);
    Task AddAsync(UserBillingAddress address, CancellationToken ct = default);
    void Remove(UserBillingAddress address);
    Task SaveChangesAsync(CancellationToken ct = default);
}
