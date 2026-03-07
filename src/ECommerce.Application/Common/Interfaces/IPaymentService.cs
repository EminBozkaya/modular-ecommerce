using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Ordering.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IPaymentService
{
    /// <summary>
    /// Charges the customer. Returns provider transaction id.
    /// Card data MUST NOT be passed — use tokenized payment tokens only.
    /// </summary>
    Task<string> ChargeAsync(Order order, string paymentToken, CancellationToken ct = default);
}
