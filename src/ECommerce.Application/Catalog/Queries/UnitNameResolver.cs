using ECommerce.Domain.Catalog.Entities;

namespace ECommerce.Application.Catalog.Queries;

/// <summary>
/// Resolves the display name of a Unit using the fallback chain:
/// requestedLang → defaultLang → unit.Name (canonical identifier)
/// Shared by both CatalogQueryHandlers and BasketQueryHandlers.
/// </summary>
internal static class UnitNameResolver
{
    public static string Resolve(Unit? unit, string requestedLang, string defaultLang)
    {
        if (unit is null) return string.Empty;
        var t = unit.Translations.FirstOrDefault(x => x.LanguageCode == requestedLang);
        var defaultT = unit.Translations.FirstOrDefault(x => x.LanguageCode == defaultLang);
        return t?.Name ?? defaultT?.Name ?? unit.Name;
    }
}
