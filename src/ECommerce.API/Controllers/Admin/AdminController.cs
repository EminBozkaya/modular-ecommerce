using ECommerce.Application.Catalog.Commands;
using ECommerce.Application.Catalog.Queries;
using ECommerce.Application.Identity.Queries;
using ECommerce.Application.Ordering.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers.Admin;

/// <summary>
/// Admin-only controller — full CRUD for catalog, users, orders.
/// architecture-rules §3: API as orchestrator, no business logic.
/// </summary>
[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;
    public AdminController(IMediator mediator) => _mediator = mediator;

    // ── Catalog Management ──

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand cmd, CancellationToken ct)
        => Ok(new { id = await _mediator.Send(cmd, ct) });

    [HttpPut("products")]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductCommand cmd, CancellationToken ct)
    {
        await _mediator.Send(cmd, ct);
        return NoContent();
    }

    [HttpDelete("products/{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteProductCommand(id), ct);
        return NoContent();
    }

    [HttpPost("products/restore/{id:guid}")]
    public async Task<IActionResult> RestoreProduct(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new RestoreProductCommand(id), ct);
        return NoContent();
    }

    [HttpPut("products/stock")]
    public async Task<IActionResult> UpdateStock([FromBody] UpdateStockCommand cmd, CancellationToken ct)
    {
        await _mediator.Send(cmd, ct);
        return NoContent();
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryCommand cmd, CancellationToken ct)
        => Ok(new { id = await _mediator.Send(cmd, ct) });

    [HttpPut("categories")]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryCommand cmd, CancellationToken ct)
    {
        await _mediator.Send(cmd, ct);
        return NoContent();
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteCategoryCommand(id), ct);
        return NoContent();
    }

    [HttpPost("categories/restore/{id:guid}")]
    public async Task<IActionResult> RestoreCategory(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new RestoreCategoryCommand(id), ct);
        return NoContent();
    }

    // ── Customer Management ──

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
        => Ok(await _mediator.Send(new GetUsersQuery(), ct));

    // ── Order Management ──

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders(CancellationToken ct)
        => Ok(await _mediator.Send(new GetOrdersQuery(), ct));

    [HttpGet("orders/{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }
}
