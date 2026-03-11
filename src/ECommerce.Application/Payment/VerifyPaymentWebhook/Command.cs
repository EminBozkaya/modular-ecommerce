using MediatR;

namespace ECommerce.Application.Payment.VerifyPaymentWebhook;

public record VerifyPaymentWebhookCommand(
    string ProviderName,
    string RawBody,
    IDictionary<string, string> Headers
) : IRequest<VerifyPaymentWebhookResponse>;

public record VerifyPaymentWebhookResponse(
    bool IsSuccess,
    string? OrderId,
    string? ErrorMessage
);
