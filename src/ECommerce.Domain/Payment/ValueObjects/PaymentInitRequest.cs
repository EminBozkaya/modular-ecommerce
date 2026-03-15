using ECommerce.Domain.Catalog.ValueObjects;

namespace ECommerce.Domain.Payment.ValueObjects;

public record PaymentInitRequest(
    string OrderId,
    string IdempotencyKey,
    Money Amount,
    string CustomerEmail,
    string CustomerName,
    string CustomerIp,
    string UserId,
    string WebhookUrl,
    string ReturnUrl,
    IReadOnlyList<PaymentItem> Items
);

public record PaymentItem(
    string Name,
    string Category,
    decimal Price,
    decimal Quantity
);

public record PaymentInitResult(
    bool IsSuccess,
    string? RedirectUrl,
    string? ProviderReference,
    string? ErrorCode,
    string? ErrorMessage
);
