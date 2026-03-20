using MediatR;

namespace ECommerce.Application.Payment.VerifyPaymentCallback;

public record VerifyPaymentCallbackCommand(
    Guid OrderId,
    string ProviderName,
    string? ProviderReference, // From query or form (e.g. token)
    IReadOnlyDictionary<string, string> Headers) : IRequest<VerifyPaymentCallbackResponse>;

public record VerifyPaymentCallbackResponse(
    bool IsSuccess,
    string? OrderId,
    string? ErrorMessage);
