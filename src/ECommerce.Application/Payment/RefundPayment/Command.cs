using MediatR;

namespace ECommerce.Application.Payment.RefundPayment;

public record RefundPaymentCommand(
    Guid OrderId,
    decimal? Amount   // null = full refund, value = partial refund
) : IRequest<RefundPaymentResponse>;

public record RefundPaymentResponse(
    bool IsSuccess,
    string? RefundId,
    string? ErrorMessage
);
