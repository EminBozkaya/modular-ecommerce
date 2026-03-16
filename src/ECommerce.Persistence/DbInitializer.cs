using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        var standardUnits = new List<(Guid Id, string Name, string Code)>
        {
            (new Guid("b2d1c1c1-c1c1-4c1c-a1c1-c1c1c1c1c1c1"), "Kilogram", "kg"),
            (Guid.NewGuid(), "Gram", "g"),
            (Guid.NewGuid(), "Adet", "adet"),
            (Guid.NewGuid(), "Litre", "lt"),
            (Guid.NewGuid(), "Paket", "paket"),
            (Guid.NewGuid(), "Deste", "deste"),
            (Guid.NewGuid(), "Koli", "koli"),
            (Guid.NewGuid(), "Kit", "kit")
        };

        foreach (var (id, name, code) in standardUnits)
        {
            if (!await context.Units.AnyAsync(u => u.Name == name))
            {
                var unit = Unit.Create(name, code);
                // If it's the default Kilogram, ensure the ID matches the migration for consistency
                if (name == "Kilogram")
                {
                    var idProp = typeof(ECommerce.Domain.Common.BaseEntity).GetProperty("Id");
                    idProp?.SetValue(unit, id);
                }
                await context.Units.AddAsync(unit);
            }
        }

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }

        await SeedTestCatalogAsync(context);
    }

    // ── Dev-only catalog seed — creates test categories, products, and translations ──
    private static async Task SeedTestCatalogAsync(ApplicationDbContext context)
    {
        // Resolve Kilogram unit (seeded above)
        var kgUnit = await context.Units.FirstOrDefaultAsync(u => u.Name == "Kilogram");
        if (kgUnit is null) return;

        // ── Categories ──────────────────────────────────────────────────────────────
        var categoryDefs = new[]
        {
            "Kuruyemiş",
            "Baharat & Şifalı Bitkiler",
            "Kuru Meyve",
            "Atıştırmalık & Mix",
        };

        foreach (var catName in categoryDefs)
        {
            if (!await context.Categories.AnyAsync(c => c.Name == catName))
                await context.Categories.AddAsync(Category.Create(catName));
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();

        // ── Products ─────────────────────────────────────────────────────────────────
        var kuruyemisCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kuruyemiş");
        var kuruMeyveCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kuru Meyve");

        var productDefs = new[]
        {
            (
                Name: "Karışık Kavrulmuş Kuruyemiş",
                Desc: "Badem, kaju ve ceviz içeren premium kavrulmuş kuruyemiş karışımı.",
                Price: 189.90m,
                Stock: 100m,
                CategoryId: kuruyemisCategory?.Id ?? Guid.Empty
            ),
            (
                Name: "Kuru Kayısı",
                Desc: "Doğrudan çiftliklerden temin edilen güneşte kurutulmuş tatlı kayısılar.",
                Price: 89.90m,
                Stock: 150m,
                CategoryId: kuruMeyveCategory?.Id ?? Guid.Empty
            ),
            (
                Name: "Premium Antep Fıstığı",
                Desc: "Hafif tuzlu ve taze kavrulmuş Gaziantep fıstıkları.",
                Price: 249.90m,
                Stock: 80m,
                CategoryId: kuruyemisCategory?.Id ?? Guid.Empty
            ),
        };

        foreach (var p in productDefs)
        {
            if (p.CategoryId == Guid.Empty) continue;
            if (!await context.Products.AnyAsync(x => x.Name == p.Name))
            {
                await context.Products.AddAsync(Product.Create(
                    p.Name, p.Desc, null,
                    new Money(p.Price, Currency.TRY),
                    new StockQuantity(p.Stock),
                    p.CategoryId,
                    kgUnit.Id));
            }
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();

        await SeedTranslationsAsync(context);
    }

    // ── Dev-only translation seed — provides EN/DE translations for testing ──
    private static async Task SeedTranslationsAsync(ApplicationDbContext context)
    {
        var categoryTranslations = new[]
        {
            ("Kuruyemiş",              "en", "Nuts & Seeds",           (string?)null),
            ("Kuruyemiş",              "de", "Nüsse & Samen",          (string?)null),
            ("Baharat & Şifalı Bitkiler", "en", "Spices & Herbs",      (string?)null),
            ("Baharat & Şifalı Bitkiler", "de", "Gewürze & Kräuter",   (string?)null),
            ("Kuru Meyve",             "en", "Dried Fruits",            (string?)null),
            ("Kuru Meyve",             "de", "Trockenfrüchte",          (string?)null),
            ("Atıştırmalık & Mix",     "en", "Snacks & Mix",            (string?)null),
            ("Atıştırmalık & Mix",     "de", "Snacks & Mix",            (string?)null),
        };

        foreach (var (categoryName, lang, translatedName, translatedDesc) in categoryTranslations)
        {
            var category = await context.Categories
                .FirstOrDefaultAsync(c => c.Name == categoryName);
            if (category is null) continue;

            var exists = await context.CategoryTranslations
                .AnyAsync(t => t.CategoryId == category.Id && t.LanguageCode == lang);
            if (exists) continue;

            await context.CategoryTranslations.AddAsync(
                CategoryTranslation.Create(category.Id, lang, translatedName, translatedDesc));
        }

        var productTranslations = new[]
        {
            ("Karışık Kavrulmuş Kuruyemiş", "en", "Mixed Roasted Nuts",     "Premium roasted nut mix with almonds, cashews and walnuts."),
            ("Karışık Kavrulmuş Kuruyemiş", "de", "Gemischte Röstnüsse",     "Premium-Röstnussmischung mit Mandeln, Cashews und Walnüssen."),
            ("Kuru Kayısı",                 "en", "Dried Apricots",          "Sun-dried sweet apricots sourced directly from farms."),
            ("Kuru Kayısı",                 "de", "Getrocknete Aprikosen",   "Sonnengereiftete süße Aprikosen direkt vom Bauernhof."),
            ("Premium Antep Fıstığı",       "en", "Premium Pistachios",      "Lightly salted and freshly roasted Gaziantep pistachios."),
            ("Premium Antep Fıstığı",       "de", "Premium Pistazien",       "Leicht gesalzene und frisch geröstete Pistazien aus Gaziantep."),
        };

        foreach (var (productName, lang, translatedName, translatedDesc) in productTranslations)
        {
            var product = await context.Products
                .FirstOrDefaultAsync(p => p.Name == productName);
            if (product is null) continue;

            var exists = await context.ProductTranslations
                .AnyAsync(t => t.ProductId == product.Id && t.LanguageCode == lang);
            if (exists) continue;

            await context.ProductTranslations.AddAsync(
                ProductTranslation.Create(product.Id, lang, translatedName, translatedDesc));
        }

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
