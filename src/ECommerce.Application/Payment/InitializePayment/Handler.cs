using ECommerce.Domain.Ordering;
using ECommerce.Domain.Ordering.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using MediatR;

namespace ECommerce.Application.Payment.InitializePayment;

public class InitializePaymentHandler : IRequestHandler<InitializePaymentCommand, InitializePaymentResponse>
{
    private readonly IOrderRepository _orders;
    private readonly IPaymentRepository _payments;
    private readonly IEnumerable<IPaymentProvider> _providers;

    private static readonly TimeSpan ExpirationWindow = TimeSpan.FromMinutes(30);

    public InitializePaymentHandler(
        IOrderRepository orders,
        IPaymentRepository payments,
        IEnumerable<IPaymentProvider> providers)
    {
        _orders = orders;
        _payments = payments;
        _providers = providers;
    }

    public async Task<InitializePaymentResponse> Handle(
        InitializePaymentCommand cmd, CancellationToken ct)
    {
        // 1. Order lookup
        var order = await _orders.GetByIdWithItemsAsync(cmd.OrderId, ct);
        if (order is null)
            throw new KeyNotFoundException($"Order '{cmd.OrderId}' not found.");

        // 2. Ownership check
        if (order.UserId.HasValue && order.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not own this order.");

        // 3. Order status check — only Pending orders can be paid
        if (order.Status != OrderStatus.Pending)
            throw new InvalidOperationException($"Cannot initiate payment: order is {order.Status}.");

        // 4. Provider lookup and currency validation
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(cmd.ProviderName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            throw new InvalidOperationException($"Payment provider '{cmd.ProviderName}' not found.");
        if (!provider.IsActive)
            throw new InvalidOperationException($"Payment provider '{cmd.ProviderName}' is currently disabled.");
        if (!provider.SupportedCurrencies.Contains(order.Total.Currency))
            throw new InvalidOperationException(
                $"Provider '{cmd.ProviderName}' does not support currency '{order.Total.Currency}'.");

        // 5. Check for existing active payment on this order
        var existingProcessing = await _payments.GetByOrderIdAndStatusAsync(cmd.OrderId, PaymentStatus.Processing, ct);
        if (existingProcessing is not null)
            existingProcessing.MarkCancelled("New payment initiated by user.");

        var existingCompleted = await _payments.GetByOrderIdAndStatusAsync(cmd.OrderId, PaymentStatus.Completed, ct);
        if (existingCompleted is not null)
            return new InitializePaymentResponse(false, null, "Order is already paid.");

        // 6. Idempotency check
        var existing = await _payments.GetByIdempotencyKeyAsync(cmd.OrderId, cmd.IdempotencyKey, ct);
        if (existing is not null && !existing.IsTerminal)
            return new InitializePaymentResponse(true, null, null); // idempotent — already in-flight

        // 7. Create PaymentRecord
        var customerName = order.UserId.HasValue
            ? "Customer"  // real name would come from user service
            : order.GuestEmail ?? "Guest";

        var paymentRecord = PaymentRecord.Create(
            cmd.OrderId,
            cmd.IdempotencyKey,
            cmd.ProviderName,
            order.Total,
            ExpirationWindow);

        await _payments.AddAsync(paymentRecord, ct);

        // 8. Build request
        var items = order.Items.Select(i => new PaymentItem(
            i.ProductName,
            "Product",
            i.UnitPrice.Amount,
            i.Quantity)).ToList();

        var initRequest = new PaymentInitRequest(
            OrderId: cmd.OrderId.ToString(),
            IdempotencyKey: cmd.IdempotencyKey,
            Amount: order.Total,
            CustomerEmail: order.GuestEmail ?? cmd.GuestEmail ?? "customer@unknown.com",
            CustomerName: customerName,
            CustomerIp: cmd.CustomerIp,
            UserId: cmd.UserId?.ToString() ?? "guest",
            WebhookUrl: $"/api/payment/webhook/{cmd.ProviderName}",
            ReturnUrl: cmd.ReturnUrl,
            Items: items);

        // 9. Call provider
        var result = await provider.InitializePaymentAsync(initRequest, ct);

        if (result.IsSuccess && result.ProviderReference is not null)
        {
            paymentRecord.MarkProcessing(result.ProviderReference);
        }
        else
        {
            paymentRecord.MarkFailed(result.ErrorMessage ?? "Provider error");
        }

        await _payments.SaveChangesAsync(ct);

        return result.IsSuccess
            ? new InitializePaymentResponse(true, result.RedirectUrl, null, result.HtmlContent)
            : new InitializePaymentResponse(false, null, result.ErrorMessage);
    }
}
