using ECommerce.Application.Basket.Commands;
using ECommerce.Application.Basket.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController : ControllerBase
{
    private readonly IMediator _mediator;
    public BasketController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var (userId, sessionId) = GetIdentifiers();
        var result = await _mediator.Send(new GetBasketQuery(userId, sessionId), ct);
        return result is null ? Ok(new { items = Array.Empty<object>() }) : Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddToBasketRequest req, CancellationToken ct)
    {
        var (userId, sessionId) = GetIdentifiers();
        await _mediator.Send(new AddToBasketCommand(userId, sessionId, req.ProductId, req.Quantity), ct);
        return Ok();
    }

    [HttpDelete("items/{productId:guid}")]
    public async Task<IActionResult> RemoveItem(Guid productId, CancellationToken ct)
    {
        var (userId, sessionId) = GetIdentifiers();
        await _mediator.Send(new RemoveFromBasketCommand(userId, sessionId, productId), ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(CancellationToken ct)
    {
        var (userId, sessionId) = GetIdentifiers();
        await _mediator.Send(new ClearBasketCommand(userId, sessionId), ct);
        return NoContent();
    }

    private (Guid? userId, string? sessionId) GetIdentifiers()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sub is not null && Guid.TryParse(sub, out var userId))
            return (userId, null);

        // Guest — use session cookie
        var sessionId = Request.Cookies["session_id"];
        if (string.IsNullOrEmpty(sessionId))
        {
            sessionId = Guid.NewGuid().ToString();
            Response.Cookies.Append("session_id", sessionId, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                MaxAge = TimeSpan.FromDays(30)
            });
        }
        return (null, sessionId);
    }
}

public record AddToBasketRequest(Guid ProductId, int Quantity);
