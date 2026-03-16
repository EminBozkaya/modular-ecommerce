namespace ECommerce.Application.Common.Interfaces;

/// <summary>
/// Provides the resolved language code for the current request.
/// Resolved from Accept-Language header, validated against SupportedLanguages,
/// falls back to DefaultLanguage if unsupported.
/// Interface lives in Application; implementation in API (HttpLanguageContext).
/// </summary>
public interface ILanguageContext
{
    /// <summary>
    /// Resolved language code for this request (e.g. "tr", "en", "de").
    /// Always returns a supported language — never null or empty.
    /// </summary>
    string Language { get; }
}
