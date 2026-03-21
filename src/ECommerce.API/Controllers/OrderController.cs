using ECommerce.Application.Ordering.Commands;
using ECommerce.Application.Ordering.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;
    public OrderController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req, CancellationToken ct)
    {
        var (userId, sessionId) = GetIdentifiers();

        // Serialize structured ShippingAddress to JSON string for domain storage (Option A)
        var shippingAddressJson = JsonSerializer.Serialize(req.ShippingAddress);

        var result = await _mediator.Send(
            new CreateOrderCommand(userId, req.GuestEmail, sessionId, shippingAddressJson), ct);

        return CreatedAtAction(nameof(GetById), new { id = result.OrderId }, new
        {
            orderId = result.OrderId,
            totalAmount = result.TotalAmount,
            currency = result.Currency
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();
        return Ok(await _mediator.Send(new GetOrdersQuery(userId), ct));
    }

    private (Guid? userId, string? sessionId) GetIdentifiers()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sub is not null && Guid.TryParse(sub, out var userId))
            return (userId, null);

        var sessionId = Request.Headers["X-Session-Id"].ToString();
        
        if (string.IsNullOrEmpty(sessionId))
            sessionId = Request.Cookies["session_id"];

        return (null, sessionId);
    }

    private Guid? GetUserId()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return sub is not null && Guid.TryParse(sub, out var id) ? id : null;
    }
}

public record CreateOrderRequest(string? GuestEmail, ShippingAddressRequest ShippingAddress);

public record ShippingAddressRequest(
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country);
