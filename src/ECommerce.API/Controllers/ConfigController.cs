using ECommerce.Application.Common.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/config")]
public class ConfigController : ControllerBase
{
    private readonly LocalizationOptions _localization;

    public ConfigController(IOptions<LocalizationOptions> localization)
        => _localization = localization.Value;

    /// <summary>
    /// Returns the active language configuration for this deployment.
    /// Frontend uses this to build its dynamic SUPPORTED_LANGUAGES list.
    /// No auth required — public endpoint.
    /// </summary>
    [HttpGet("languages")]
    public IActionResult GetLanguages()
    {
        return Ok(new
        {
            defaultLanguage = _localization.DefaultLanguage,
            supportedLanguages = _localization.SupportedLanguages
        });
    }
}
