using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Ordering.Entities;

namespace ECommerce.Infrastructure.Payment;

/// <summary>
/// Stub payment service — swap with Iyzico/Stripe SDK implementation without changing Application layer.
/// </summary>
public class StubPaymentService : IPaymentService
{
    public Task<string> ChargeAsync(Order order, string paymentToken, CancellationToken ct = default)
    {
        // TODO: integrate with real payment provider (Iyzico / Stripe)
        // Return a fake transaction ID for now
        var transactionId = $"TXN-{Guid.NewGuid():N}";
        return Task.FromResult(transactionId);
    }
}
