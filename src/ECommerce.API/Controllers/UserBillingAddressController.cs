using ECommerce.Application.Identity.Commands;
using ECommerce.Application.Identity.Queries;
using ECommerce.Domain.Ordering.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/billing-addresses")]
[Authorize]
public class UserBillingAddressController : ControllerBase
{
    private readonly IMediator _mediator;
    public UserBillingAddressController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetUserBillingAddressesQuery(userId), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddBillingAddressRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var id = await _mediator.Send(new AddUserBillingAddressCommand(
            userId,
            request.Title,
            request.InvoiceType,
            request.FullName,
            request.TcKimlikNo,
            request.CompanyName,
            request.TaxOffice,
            request.TaxNumber,
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
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBillingAddressRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new UpdateUserBillingAddressCommand(
            id, userId,
            request.Title,
            request.InvoiceType,
            request.FullName,
            request.TcKimlikNo,
            request.CompanyName,
            request.TaxOffice,
            request.TaxNumber,
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
        await _mediator.Send(new DeleteUserBillingAddressCommand(id, userId), ct);
        return NoContent();
    }

    [HttpPatch("{id:guid}/default")]
    public async Task<IActionResult> SetDefault(Guid id, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new SetDefaultBillingAddressCommand(id, userId), ct);
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

public record AddBillingAddressRequest(
    string Title,
    InvoiceType InvoiceType,
    string? FullName,
    string? TcKimlikNo,
    string? CompanyName,
    string? TaxOffice,
    string? TaxNumber,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    bool IsDefault = false,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null);

public record UpdateBillingAddressRequest(
    string Title,
    InvoiceType InvoiceType,
    string? FullName,
    string? TcKimlikNo,
    string? CompanyName,
    string? TaxOffice,
    string? TaxNumber,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string PostalCode,
    string Country,
    int? CountryId = null,
    int? CityId = null,
    int? DistrictId = null);
