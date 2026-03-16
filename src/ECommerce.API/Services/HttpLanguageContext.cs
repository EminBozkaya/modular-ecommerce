using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Settings;
using Microsoft.Extensions.Options;

namespace ECommerce.API.Services;

/// <summary>
/// Resolves the request language from the Accept-Language header.
/// Priority: Accept-Language header → DefaultLanguage fallback.
/// Only returns languages listed in SupportedLanguages.
/// </summary>
public sealed class HttpLanguageContext : ILanguageContext
{
    private readonly string _language;

    public HttpLanguageContext(IHttpContextAccessor httpContextAccessor, IOptions<LocalizationOptions> options)
    {
        var localization = options.Value;
        var header = httpContextAccessor.HttpContext?
            .Request.Headers["Accept-Language"]
            .ToString();

        _language = ResolveLanguage(header, localization);
    }

    public string Language => _language;

    private static string ResolveLanguage(string? header, LocalizationOptions options)
    {
        if (string.IsNullOrWhiteSpace(header))
            return options.DefaultLanguage;

        // "en-US,en;q=0.9,tr;q=0.8" → try each in order
        foreach (var part in header.Split(','))
        {
            // "en-US;q=0.9" → "en-US" → "en"
            var tag = part.Split(';')[0].Trim();
            var code = tag.Length >= 2 ? tag[..2].ToLowerInvariant() : tag.ToLowerInvariant();

            if (options.IsSupported(code))
                return code;
        }

        return options.DefaultLanguage;
    }
}
