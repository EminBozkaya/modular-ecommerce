using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Common.Interfaces;
using ECommerce.Domain.Ordering;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Entities;
using MediatR;

namespace ECommerce.Application.Payment.Commands;

public class ProcessPaymentHandler : IRequestHandler<ProcessPaymentCommand, Guid>
{
    private readonly IOrderRepository _orders;
    private readonly IPaymentRepository _payments;
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUser;

    public ProcessPaymentHandler(
        IOrderRepository orders,
        IPaymentRepository payments,
        IPaymentService paymentService,
        ICurrentUserService currentUser)
    {
        _orders = orders;
        _payments = payments;
        _paymentService = paymentService;
        _currentUser = currentUser;
    }

    public async Task<Guid> Handle(ProcessPaymentCommand cmd, CancellationToken ct)
    {
        // Authorization — verify the caller owns this order
        if (!Guid.TryParse(_currentUser.UserId, out var currentUserId))
            throw new UnauthorizedAccessException("User identity could not be determined.");

        // Idempotency check — return existing result if already processed
        var existing = await _payments.GetByIdempotencyKeyAsync(cmd.OrderId, cmd.IdempotencyKey, ct);
        if (existing is not null)
            return existing.Id;

        var order = await _orders.GetByIdWithItemsAsync(cmd.OrderId, ct)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.UserId != currentUserId)
            throw new UnauthorizedAccessException("You are not authorized to pay for this order.");

        var payment = PaymentRecord.CreatePending(order.Id, order.Total, "CreditCard", cmd.IdempotencyKey);
        await _payments.AddAsync(payment, ct);

        try
        {
            var transactionId = await _paymentService.ChargeAsync(order, cmd.PaymentToken, ct);
            payment.MarkSucceeded(transactionId);
            order.MarkAsPaid();
        }
        catch (Exception ex)
        {
            payment.MarkFailed(ex.Message);
            throw;
        }

        await _payments.SaveChangesAsync(ct);
        return payment.Id;
    }
}
