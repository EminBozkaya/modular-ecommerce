using ECommerce.Application.Wishlist.Commands;
using ECommerce.Application.Wishlist.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IMediator _mediator;
    public WishlistController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetWishlistQuery(userId), ct);
        return Ok(result);
    }

    [HttpGet("product-ids")]
    public async Task<IActionResult> GetProductIds(CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetWishlistProductIdsQuery(userId), ct);
        return Ok(result);
    }

    [HttpPost("{productId:guid}")]
    public async Task<IActionResult> Add(Guid productId, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new AddToWishlistCommand(userId, productId), ct);
        return Ok();
    }

    [HttpDelete("{productId:guid}")]
    public async Task<IActionResult> Remove(Guid productId, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new RemoveFromWishlistCommand(userId, productId), ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new ClearWishlistCommand(userId), ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User not authenticated.");
        return Guid.Parse(sub);
    }
}
