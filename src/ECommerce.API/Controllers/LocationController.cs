using ECommerce.Application.Identity.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

/// <summary>
/// Read-only endpoints for cascading location dropdowns.
/// GET /api/countries
/// GET /api/cities?countryId={id}
/// GET /api/districts?cityId={id}
/// </summary>
[ApiController]
[Route("api")]
public class LocationController : ControllerBase
{
    private readonly IMediator _mediator;
    public LocationController(IMediator mediator) => _mediator = mediator;

    /// <summary>Returns all countries.</summary>
    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCountriesQuery(), ct);
        return Ok(result);
    }

    /// <summary>Returns cities for the given country.</summary>
    [HttpGet("cities")]
    public async Task<IActionResult> GetCities([FromQuery] int countryId, CancellationToken ct)
    {
        if (countryId <= 0)
            return BadRequest("countryId must be a positive integer.");

        var result = await _mediator.Send(new GetCitiesByCountryQuery(countryId), ct);
        return Ok(result);
    }

    /// <summary>Returns districts for the given city.</summary>
    [HttpGet("districts")]
    public async Task<IActionResult> GetDistricts([FromQuery] int cityId, CancellationToken ct)
    {
        if (cityId <= 0)
            return BadRequest("cityId must be a positive integer.");

        var result = await _mediator.Send(new GetDistrictsByCityQuery(cityId), ct);
        return Ok(result);
    }
}
