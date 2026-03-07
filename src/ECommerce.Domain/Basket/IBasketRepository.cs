namespace ECommerce.Domain.Basket;

/// <summary>
/// Aggregate repository for the Basket aggregate root.
/// All queries include Items navigation by default.
/// </summary>
public interface IBasketRepository
{
    Task<Entities.Basket?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Entities.Basket?> GetBySessionIdAsync(string sessionId, CancellationToken ct = default);
    Task AddAsync(Entities.Basket basket, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
