using MediatR;

namespace ECommerce.Application.Ordering.Commands;

public record CreateOrderCommand(
    Guid? UserId,
    string? GuestEmail,
    string? SessionId,   // to locate guest basket
    string ShippingAddress,
    string? BillingAddress = null) : IRequest<CreateOrderResult>;

public record CreateOrderResult(Guid OrderId, decimal TotalAmount, string Currency);

public record UpdateOrderStatusCommand(Guid OrderId, string NewStatus) : IRequest;
public record DeleteOrderCommand(Guid OrderId) : IRequest;
public record RestoreOrderCommand(Guid OrderId) : IRequest;
