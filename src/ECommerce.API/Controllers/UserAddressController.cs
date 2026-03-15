using ECommerce.Application.Identity.Commands;
using ECommerce.Application.Identity.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/addresses")]
[Authorize]
public class UserAddressController : ControllerBase
{
    private readonly IMediator _mediator;
    public UserAddressController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetUserAddressesQuery(userId), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddUserAddressRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var id = await _mediator.Send(new AddUserAddressCommand(
            userId,
            request.Title,
            request.FullName,
            request.AddressLine1,
            request.AddressLine2,
            request.City,
            request.PostalCode,
            request.Country,
            request.IsDefault,
            request.CountryId,
            request.CityId,
            request.DistrictId), ct);
        return CreatedAtAction(nameof(GetAll), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserAddressRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new UpdateUserAddressCommand(
            id, userId,
            request.Title,
            request.FullName,
            request.AddressLine1,
            request.AddressLine2,
            request.City,
            request.PostalCode,
            request.Country,
            request.CountryId,
            request.CityId,
            request.DistrictId), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new DeleteUserAddressCommand(id, userId), ct);
        return NoContent();
    }

    [HttpPatch("{id:guid}/default")]
    public async Task<IActionResult> SetDefault(Guid id, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new SetDefaultAddressCommand(id, userId), ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User not authenticated.");
        return Guid.Parse(sub);
    }
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

public record AddUserAddressRequest(
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsDefault = false,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null);

public record UpdateUserAddressRequest(
    string Title,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null);
