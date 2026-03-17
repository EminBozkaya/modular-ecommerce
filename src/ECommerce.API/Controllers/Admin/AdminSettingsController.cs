using ECommerce.Application.Settings.Commands;
using ECommerce.Application.Settings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminSettingsController(IMediator mediator) => _mediator = mediator;

    // ── Store Settings ──────────────────────────────────────────

    [HttpGet("store-settings")]
    public async Task<IActionResult> GetStoreSettings(CancellationToken ct)
        => Ok(await _mediator.Send(new GetStoreSettingsQuery(), ct));

    [HttpPut("store-settings")]
    public async Task<IActionResult> UpdateStoreSettings(
        [FromBody] UpdateStoreSettingsCommand cmd, CancellationToken ct)
    {
        await _mediator.Send(cmd, ct);
        return NoContent();
    }

    // ── App Settings (payment, cargo, auth, …) ──────────────────

    [HttpGet("app-settings/{category}")]
    public async Task<IActionResult> GetAppSettings(string category, CancellationToken ct)
    {
        var json = await _mediator.Send(new GetAppSettingsByCategoryQuery(category), ct);
        if (json is null) return NotFound();
        return Content(json, "application/json");
    }

    [HttpPut("app-settings/{category}")]
    public async Task<IActionResult> UpsertAppSettings(
        string category, [FromBody] string settingsJson, CancellationToken ct)
    {
        await _mediator.Send(new UpsertAppSettingsCommand(category, settingsJson), ct);
        return NoContent();
    }
}
