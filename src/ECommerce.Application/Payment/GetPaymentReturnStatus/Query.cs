using MediatR;

namespace ECommerce.Application.Payment.GetPaymentReturnStatus;

public record GetPaymentReturnStatusQuery(
    Guid OrderId,
    Guid? UserId
) : IRequest<PaymentReturnStatusResponse>;

public record PaymentReturnStatusResponse(
    string OrderId,
    string Status,    // string to keep API layer free of Domain enum dependency
    bool IsTerminal
);
