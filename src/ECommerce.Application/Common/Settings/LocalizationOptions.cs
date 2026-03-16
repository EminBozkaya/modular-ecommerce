namespace ECommerce.Application.Common.Settings;

public sealed class LocalizationOptions
{
    public const string SectionName = "Localization";

    public string DefaultLanguage { get; init; } = "tr";
    public List<string> SupportedLanguages { get; init; } = ["tr"];

    public bool IsSupported(string languageCode) =>
        SupportedLanguages.Contains(languageCode, StringComparer.OrdinalIgnoreCase);
}
