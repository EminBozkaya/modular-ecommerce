using ECommerce.Application.Payment.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IMediator _mediator;
    public PaymentController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentRequest req, CancellationToken ct)
    {
        var transactionId = await _mediator.Send(
            new ProcessPaymentCommand(req.OrderId, req.PaymentToken, req.IdempotencyKey), ct);
        return Ok(new { success = true, transactionId });
    }
}

public record ProcessPaymentRequest(Guid OrderId, string PaymentToken, string IdempotencyKey);
