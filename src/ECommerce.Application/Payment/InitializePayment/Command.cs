using MediatR;

namespace ECommerce.Application.Payment.InitializePayment;

public record InitializePaymentCommand(
    Guid OrderId,
    string ProviderName,
    string IdempotencyKey,
    string ReturnUrl,
    Guid? UserId,
    string? GuestEmail,
    string CustomerIp
) : IRequest<InitializePaymentResponse>;

public record InitializePaymentResponse(
    bool IsSuccess,
    string? RedirectUrl,
    string? ErrorMessage
);
