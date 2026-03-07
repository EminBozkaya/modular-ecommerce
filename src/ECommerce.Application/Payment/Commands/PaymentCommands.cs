using MediatR;

namespace ECommerce.Application.Payment.Commands;

public record ProcessPaymentCommand(
    Guid OrderId,
    string PaymentToken,
    string IdempotencyKey) : IRequest<Guid>;  // Returns PaymentRecord Id
