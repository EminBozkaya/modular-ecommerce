using MediatR;

namespace ECommerce.Application.Ordering.Commands;

public record CreateOrderCommand(
    Guid? UserId,
    string? GuestEmail,
    string? SessionId,   // to locate guest basket
    string ShippingAddress) : IRequest<Guid>;
