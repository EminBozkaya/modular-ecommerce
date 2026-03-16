using ECommerce.Application.Catalog.Commands;
using ECommerce.Application.Catalog.Queries;
using ECommerce.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILanguageContext _language;

    public CatalogController(IMediator mediator, ILanguageContext language)
    {
        _mediator = mediator;
        _language = language;
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] Guid? categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool descending = false,
        [FromQuery] bool includeInactive = false,
        [FromQuery] bool includeDeleted = false,
        CancellationToken ct = default)
        => Ok(await _mediator.Send(
            new GetProductsQuery(search, minPrice, maxPrice, categoryId, page, pageSize, sortBy, descending, includeInactive, includeDeleted, _language.Language), ct));

    [HttpGet("products/{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id, _language.Language), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(
        [FromQuery] bool onlyMain,
        [FromQuery] bool includeDeleted,
        CancellationToken ct = default)
        => Ok(await _mediator.Send(new GetCategoriesQuery(onlyMain, includeDeleted, _language.Language), ct));

    [HttpGet("units")]
    public async Task<IActionResult> GetUnits(CancellationToken ct)
        => Ok(await _mediator.Send(new GetUnitsQuery(), ct));
}
