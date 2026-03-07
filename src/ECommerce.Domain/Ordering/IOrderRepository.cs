using ECommerce.Domain.Ordering.Entities;

namespace ECommerce.Domain.Ordering;

/// <summary>
/// Aggregate repository for the Order aggregate root.
/// </summary>
public interface IOrderRepository
{
    Task<Order?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Order>> GetAllWithItemsAsync(Guid? userId, CancellationToken ct = default);
    Task AddAsync(Order order, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
