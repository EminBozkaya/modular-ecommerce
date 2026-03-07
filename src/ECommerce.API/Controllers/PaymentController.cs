using ECommerce.Application.Payment.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IMediator _mediator;
    public PaymentController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentRequest req, CancellationToken ct)
    {
        var paymentId = await _mediator.Send(
            new ProcessPaymentCommand(req.OrderId, req.PaymentToken, req.IdempotencyKey), ct);
        return Ok(new { paymentId });
    }
}

public record ProcessPaymentRequest(Guid OrderId, string PaymentToken, string IdempotencyKey);
