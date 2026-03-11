using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Payment.Enums;

namespace ECommerce.Domain.Payment.ValueObjects;

public record PaymentVerifyRequest(
    string OrderId,
    string ProviderReference,
    string RawPayload,
    IDictionary<string, string> Headers
);

public record PaymentVerifyResult(
    bool IsSuccess,
    string? TransactionId,
    Money? VerifiedAmount,
    string? ErrorCode,
    string? ErrorMessage,
    PaymentStatus ResultStatus
);
