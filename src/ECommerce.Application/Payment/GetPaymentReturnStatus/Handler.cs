using ECommerce.Domain.Ordering;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using MediatR;

namespace ECommerce.Application.Payment.GetPaymentReturnStatus;

public class GetPaymentReturnStatusHandler
    : IRequestHandler<GetPaymentReturnStatusQuery, PaymentReturnStatusResponse>
{
    private readonly IPaymentRepository _payments;
    private readonly IOrderRepository _orders;

    public GetPaymentReturnStatusHandler(
        IPaymentRepository payments,
        IOrderRepository orders)
    {
        _payments = payments;
        _orders = orders;
    }

    public async Task<PaymentReturnStatusResponse> Handle(
        GetPaymentReturnStatusQuery query, CancellationToken ct)
    {
        // Ownership check
        var order = await _orders.GetByIdWithItemsAsync(query.OrderId, ct);
        if (order is null)
            throw new KeyNotFoundException($"Order '{query.OrderId}' not found.");

        if (order.UserId.HasValue && order.UserId != query.UserId)
            throw new UnauthorizedAccessException("You do not own this order.");

        // Find the most recent non-expired, non-cancelled payment record
        var payment = await _payments.GetByOrderIdAndStatusAsync(query.OrderId, PaymentStatus.Processing, ct)
            ?? await _payments.GetByOrderIdAndStatusAsync(query.OrderId, PaymentStatus.Completed, ct)
            ?? await _payments.GetByOrderIdAndStatusAsync(query.OrderId, PaymentStatus.Failed, ct)
            ?? await _payments.GetByOrderIdAndStatusAsync(query.OrderId, PaymentStatus.Expired, ct);

        if (payment is null)
            return new PaymentReturnStatusResponse(
                query.OrderId.ToString(), PaymentStatus.Pending.ToString(), false);

        return new PaymentReturnStatusResponse(
            query.OrderId.ToString(),
            payment.Status.ToString(),
            payment.IsTerminal);
    }
}
