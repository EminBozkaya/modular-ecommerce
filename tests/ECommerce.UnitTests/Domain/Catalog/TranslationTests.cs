using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using FluentAssertions;

namespace ECommerce.UnitTests.Domain.Catalog;

/// <summary>
/// Tests for the language-agnostic translation architecture.
/// Verifies that UpsertTranslation correctly handles all languages including
/// the DefaultLanguage (TR), and that the fallback chain works as expected.
/// </summary>
public class TranslationTests
{
    private readonly Guid _categoryId = Guid.NewGuid();
    private readonly Guid _unitId = Guid.NewGuid();
    private readonly Money _price = new(100, Currency.TRY);
    private readonly StockQuantity _stock = new(10);

    // ── Product.UpsertTranslation ─────────────────────────────────────────────

    [Fact]
    public void UpsertTranslation_DefaultLanguage_AddsTranslationRow()
    {
        var product = Product.Create("Kavrulmuş Badem", "Taze kavrulmuş.", null, _price, _stock, _categoryId, _unitId);

        product.UpsertTranslation("tr", "Kavrulmuş Badem", "Taze kavrulmuş.");

        product.Translations.Should().ContainSingle(t => t.LanguageCode == "tr");
        product.Translations.Single(t => t.LanguageCode == "tr").Name.Should().Be("Kavrulmuş Badem");
    }

    [Fact]
    public void UpsertTranslation_NonDefaultLanguage_AddsTranslationRow()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);

        product.UpsertTranslation("en", "Roasted Almonds", "Freshly roasted.");

        product.Translations.Should().ContainSingle(t => t.LanguageCode == "en");
        product.Translations.Single(t => t.LanguageCode == "en").Name.Should().Be("Roasted Almonds");
    }

    [Fact]
    public void UpsertTranslation_AllThreeLanguages_CreatesThreeRows()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);

        product.UpsertTranslation("tr", "Kavrulmuş Badem", null);
        product.UpsertTranslation("en", "Roasted Almonds", null);
        product.UpsertTranslation("de", "Geröstete Mandeln", null);

        product.Translations.Should().HaveCount(3);
        product.Translations.Select(t => t.LanguageCode).Should().BeEquivalentTo(["tr", "en", "de"]);
    }

    [Fact]
    public void UpsertTranslation_CalledTwiceForSameLanguage_UpdatesExistingRow()
    {
        var product = Product.Create("Eski Ad", null, null, _price, _stock, _categoryId, _unitId);
        product.UpsertTranslation("tr", "Eski Ad", null);

        product.UpsertTranslation("tr", "Yeni Ad", "Yeni açıklama.");

        product.Translations.Should().ContainSingle(t => t.LanguageCode == "tr");
        var tr = product.Translations.Single(t => t.LanguageCode == "tr");
        tr.Name.Should().Be("Yeni Ad");
        tr.Description.Should().Be("Yeni açıklama.");
    }

    [Fact]
    public void UpsertTranslation_WithEmptyLanguageCode_Throws()
    {
        var product = Product.Create("Test", null, null, _price, _stock, _categoryId, _unitId);

        Action act = () => product.UpsertTranslation("", "Name", null);

        act.Should().Throw<ArgumentException>();
    }

    // ── Category.UpsertTranslation ────────────────────────────────────────────

    [Fact]
    public void Category_UpsertTranslation_DefaultLanguage_AddsRow()
    {
        var category = Category.Create("Kategori-A");

        category.UpsertTranslation("tr", "Kategori-A", null);

        category.Translations.Should().ContainSingle(t => t.LanguageCode == "tr");
    }

    [Fact]
    public void Category_UpsertTranslation_MultipleLanguages_AllPresent()
    {
        var category = Category.Create("Kategori-A");

        category.UpsertTranslation("tr", "Kategori-A", null);
        category.UpsertTranslation("en", "Category-A", null);
        category.UpsertTranslation("de", "Kategorie-A", null);

        category.Translations.Should().HaveCount(3);
    }

    // ── Name resolution fallback logic (mirrors query handler behavior) ───────
    // These tests document the expected fallback chain:
    // requested language → DefaultLanguage → entity.Name

    [Fact]
    public void NameResolution_RequestedLangExists_ReturnsRequestedTranslation()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);
        product.UpsertTranslation("tr", "Kavrulmuş Badem", null);
        product.UpsertTranslation("en", "Roasted Almonds", null);

        var requestedLang = "en";
        var defaultLang = "tr";
        var t = product.Translations.FirstOrDefault(x => x.LanguageCode == requestedLang);
        var defaultT = product.Translations.FirstOrDefault(x => x.LanguageCode == defaultLang);
        var resolvedName = t?.Name ?? defaultT?.Name ?? product.Name;

        resolvedName.Should().Be("Roasted Almonds");
    }

    [Fact]
    public void NameResolution_RequestedLangMissing_FallsBackToDefaultLanguage()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);
        product.UpsertTranslation("tr", "Kavrulmuş Badem", null);
        // No DE translation

        var requestedLang = "de";
        var defaultLang = "tr";
        var t = product.Translations.FirstOrDefault(x => x.LanguageCode == requestedLang);
        var defaultT = product.Translations.FirstOrDefault(x => x.LanguageCode == defaultLang);
        var resolvedName = t?.Name ?? defaultT?.Name ?? product.Name;

        resolvedName.Should().Be("Kavrulmuş Badem");
    }

    [Fact]
    public void NameResolution_NoTranslationsAtAll_FallsBackToEntityName()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);
        // No translations at all (legacy/migration scenario)

        var requestedLang = "en";
        var defaultLang = "tr";
        var t = product.Translations.FirstOrDefault(x => x.LanguageCode == requestedLang);
        var defaultT = product.Translations.FirstOrDefault(x => x.LanguageCode == defaultLang);
        var resolvedName = t?.Name ?? defaultT?.Name ?? product.Name;

        resolvedName.Should().Be("Kavrulmuş Badem");
    }

    [Fact]
    public void NameResolution_RequestingDefaultLang_ReturnsTRTranslation()
    {
        var product = Product.Create("Kavrulmuş Badem", null, null, _price, _stock, _categoryId, _unitId);
        product.UpsertTranslation("tr", "Kavrulmuş Badem", null);
        product.UpsertTranslation("en", "Roasted Almonds", null);

        var requestedLang = "tr";
        var defaultLang = "tr";
        var t = product.Translations.FirstOrDefault(x => x.LanguageCode == requestedLang);
        var defaultT = product.Translations.FirstOrDefault(x => x.LanguageCode == defaultLang);
        var resolvedName = t?.Name ?? defaultT?.Name ?? product.Name;

        resolvedName.Should().Be("Kavrulmuş Badem");
    }
}
