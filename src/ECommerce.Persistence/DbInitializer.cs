using System.Text.Json;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Settings.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, string? contentRootPath = null)
    {
        await SeedStoreSettingsAsync(context, contentRootPath);

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

    // ── Seed Ebrar Kuruyemiş branding data into StoreSettings ──────────────────
    private static async Task SeedStoreSettingsAsync(ApplicationDbContext context, string? contentRootPath)
    {
        if (await context.StoreSettings.AnyAsync()) return;

        string? logoBase64 = null;
        if (contentRootPath is not null)
        {
            var logoPath = Path.GetFullPath(
                Path.Combine(contentRootPath, "..", "ECommerce.Web", "src", "assets", "LOGO.png"));
            if (File.Exists(logoPath))
            {
                var bytes = await File.ReadAllBytesAsync(logoPath);
                logoBase64 = $"data:image/png;base64,{Convert.ToBase64String(bytes)}";
            }
        }

        var settingsJson = JsonSerializer.Serialize(new
        {
            StoreName = "Ebrar Kuruyemiş",
            ShowStoreNameInHeader = false, // logo already contains the brand name
            PrimaryColor = "#1B5E3F",
            NavbarActiveColor = "#FFFFFF",
            FreeShippingBannerText = "1000TL ÜZERİ SİPARİŞLERDE KARGO BEDAVA!",
            FreeShippingBannerVisible = true,
            FreeShippingBannerMarquee = false,
            FreeShippingBannerMarqueeSpeed = 5,
            BackgroundPatternBase64 = (string?)null,
            BackgroundPatternOpacity = 20,
            BackgroundColor = "#F5FFEA",
            HeroCarousel = new
            {
                Enabled = true,
                Effect = "slide",
                Height = 500,
                AutoPlay = true,
                AutoPlayInterval = 5000,
                Loop = true,
                ShowArrows = true,
                ShowDots = true,
                Slides = new[]
                {
                    new
                    {
                        Id = "ebrar-slide-1",
                        ImageBase64 = (string?)null,
                        ImageUrl = (string?)null,
                        Title = "Doğanın En Taze Lezzetleri",
                        Subtitle = "Kuruyemiş & Doğal Ürünler",
                        Description = "En kaliteli kuruyemişleri özenle seçip kapınıza getiriyoruz. 1000₺ üzeri siparişlerde kargo bedava!",
                        TextColor = "#FFFFFF",
                        OverlayColor = "#1B5E3F",
                        OverlayOpacity = 88,
                        ButtonText = "Hemen Alışveriş Yap",
                        ButtonLink = "/products",
                        ButtonVisible = true,
                    },
                    new
                    {
                        Id = "ebrar-slide-2",
                        ImageBase64 = (string?)null,
                        ImageUrl = (string?)null,
                        Title = "Toptan Avantajlı Fiyatlar",
                        Subtitle = "İşletmeniz için en uygun fiyatlar",
                        Description = "Badem, Ceviz, Fındık, Fıstık ve daha fazlası. Toplu alımlarda özel indirimler.",
                        TextColor = "#FFFFFF",
                        OverlayColor = "#0D3B22",
                        OverlayOpacity = 85,
                        ButtonText = "Ürünleri Keşfet",
                        ButtonLink = "/products",
                        ButtonVisible = true,
                    },
                },
            },
        }, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        var storeSettings = StoreSettings.Create(logoBase64, settingsJson);
        await context.StoreSettings.AddAsync(storeSettings);
        await context.SaveChangesAsync();
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

    // ── Dev-only translation seed — provides TR/EN/DE translations for all entities ──
    // Language-agnostic architecture: TR (DefaultLanguage) lives in the translations table
    // alongside EN and DE — no language is treated as special.
    private static async Task SeedTranslationsAsync(ApplicationDbContext context)
    {
        var categoryTranslations = new[]
        {
            // TR (DefaultLanguage) — same name as entity.Name, required for the language-agnostic model
            ("Kuruyemiş",                 "tr", "Kuruyemiş",              (string?)null),
            ("Baharat & Şifalı Bitkiler", "tr", "Baharat & Şifalı Bitkiler", (string?)null),
            ("Kuru Meyve",                "tr", "Kuru Meyve",             (string?)null),
            ("Atıştırmalık & Mix",        "tr", "Atıştırmalık & Mix",     (string?)null),
            // EN
            ("Kuruyemiş",                 "en", "Nuts & Seeds",           (string?)null),
            ("Baharat & Şifalı Bitkiler", "en", "Spices & Herbs",         (string?)null),
            ("Kuru Meyve",                "en", "Dried Fruits",            (string?)null),
            ("Atıştırmalık & Mix",        "en", "Snacks & Mix",            (string?)null),
            // DE
            ("Kuruyemiş",                 "de", "Nüsse & Samen",          (string?)null),
            ("Baharat & Şifalı Bitkiler", "de", "Gewürze & Kräuter",      (string?)null),
            ("Kuru Meyve",                "de", "Trockenfrüchte",          (string?)null),
            ("Atıştırmalık & Mix",        "de", "Snacks & Mix",            (string?)null),
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
            // TR (DefaultLanguage)
            ("Karışık Kavrulmuş Kuruyemiş", "tr", "Karışık Kavrulmuş Kuruyemiş", "Badem, kaju ve ceviz içeren premium kavrulmuş kuruyemiş karışımı."),
            ("Kuru Kayısı",                 "tr", "Kuru Kayısı",                  "Doğrudan çiftliklerden temin edilen güneşte kurutulmuş tatlı kayısılar."),
            ("Premium Antep Fıstığı",       "tr", "Premium Antep Fıstığı",        "Hafif tuzlu ve taze kavrulmuş Gaziantep fıstıkları."),
            // EN
            ("Karışık Kavrulmuş Kuruyemiş", "en", "Mixed Roasted Nuts",     "Premium roasted nut mix with almonds, cashews and walnuts."),
            ("Kuru Kayısı",                 "en", "Dried Apricots",          "Sun-dried sweet apricots sourced directly from farms."),
            ("Premium Antep Fıstığı",       "en", "Premium Pistachios",      "Lightly salted and freshly roasted Gaziantep pistachios."),
            // DE
            ("Karışık Kavrulmuş Kuruyemiş", "de", "Gemischte Röstnüsse",     "Premium-Röstnussmischung mit Mandeln, Cashews und Walnüssen."),
            ("Kuru Kayısı",                 "de", "Getrocknete Aprikosen",   "Sonnengereiftete süße Aprikosen direkt vom Bauernhof."),
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
