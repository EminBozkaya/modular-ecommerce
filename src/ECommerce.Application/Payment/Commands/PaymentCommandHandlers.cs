using ECommerce.Application.Common.Interfaces;
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

    public ProcessPaymentHandler(IOrderRepository orders, IPaymentRepository payments, IPaymentService paymentService)
    {
        _orders = orders;
        _payments = payments;
        _paymentService = paymentService;
    }

    public async Task<Guid> Handle(ProcessPaymentCommand cmd, CancellationToken ct)
    {
        // Idempotency check — return existing result if already processed
        var existing = await _payments.GetByIdempotencyKeyAsync(cmd.OrderId, cmd.IdempotencyKey, ct);
        if (existing is not null)
            return existing.Id;

        var order = await _orders.GetByIdWithItemsAsync(cmd.OrderId, ct)
            ?? throw new KeyNotFoundException("Order not found.");

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
