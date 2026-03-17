using ECommerce.Application.Settings.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

/// <summary>
/// Public (unauthenticated) endpoints for store configuration that the
/// storefront reads on every page load (background color, logo, banner text…).
/// </summary>
[ApiController]
[Route("api/store")]
public class StoreController : ControllerBase
{
    private readonly IMediator _mediator;

    public StoreController(IMediator mediator) => _mediator = mediator;

    [HttpGet("settings")]
    public async Task<IActionResult> GetStoreSettings(CancellationToken ct)
        => Ok(await _mediator.Send(new GetStoreSettingsQuery(), ct));
}
