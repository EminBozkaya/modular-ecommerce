using ECommerce.Application.Catalog.Commands;
using ECommerce.Application.Catalog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly IMediator _mediator;
    public CatalogController(IMediator mediator) => _mediator = mediator;

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] GetProductsQuery query, CancellationToken ct)
        => Ok(await _mediator.Send(query, ct));

    [HttpGet("products/{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(CancellationToken ct)
        => Ok(await _mediator.Send(new GetCategoriesQuery(), ct));
}
