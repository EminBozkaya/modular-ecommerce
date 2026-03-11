using ECommerce.Domain.Catalog.ValueObjects;

namespace ECommerce.Domain.Payment.ValueObjects;

public record RefundRequest(
    string OrderId,
    string TransactionId,
    Money? Amount  // null = tam iade, değer = kısmi iade
);

public record RefundResult(
    bool IsSuccess,
    string? RefundId,
    string? ErrorCode,
    string? ErrorMessage
);
