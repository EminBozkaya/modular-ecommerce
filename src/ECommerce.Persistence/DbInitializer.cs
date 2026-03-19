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

        await SeedUnitTranslationsAsync(context);
        await SeedTestCatalogAsync(context);
    }

    // ── Seed Unit Translations (all 8 units × 7 languages) ─────────────────────
    private static async Task SeedUnitTranslationsAsync(ApplicationDbContext context)
    {
        // translations: code → lang → display name
        var translations = new Dictionary<string, Dictionary<string, string>>
        {
            ["kg"]    = new() { ["tr"]="Kilogram",  ["en"]="Kilogram",  ["de"]="Kilogramm",     ["fr"]="Kilogramme",  ["es"]="Kilogramo",  ["ru"]="Килограмм",  ["ar"]="كيلوغرام" },
            ["g"]     = new() { ["tr"]="Gram",      ["en"]="Gram",      ["de"]="Gramm",          ["fr"]="Gramme",      ["es"]="Gramo",       ["ru"]="Грамм",      ["ar"]="جرام"     },
            ["adet"]  = new() { ["tr"]="Adet",      ["en"]="Piece",     ["de"]="Stück",          ["fr"]="Pièce",       ["es"]="Unidad",      ["ru"]="Штука",      ["ar"]="قطعة"     },
            ["lt"]    = new() { ["tr"]="Litre",     ["en"]="Liter",     ["de"]="Liter",          ["fr"]="Litre",       ["es"]="Litro",       ["ru"]="Литр",       ["ar"]="لتر"      },
            ["paket"] = new() { ["tr"]="Paket",     ["en"]="Package",   ["de"]="Paket",          ["fr"]="Paquet",      ["es"]="Paquete",     ["ru"]="Пакет",      ["ar"]="حزمة"     },
            ["deste"] = new() { ["tr"]="Deste",     ["en"]="Bundle",    ["de"]="Bündel",         ["fr"]="Botte",       ["es"]="Manojo",      ["ru"]="Пучок",      ["ar"]="بندل"     },
            ["koli"]  = new() { ["tr"]="Koli",      ["en"]="Box",       ["de"]="Karton",         ["fr"]="Carton",      ["es"]="Caja",        ["ru"]="Коробка",    ["ar"]="صندوق"    },
            ["kit"]   = new() { ["tr"]="Kit",       ["en"]="Kit",       ["de"]="Kit",            ["fr"]="Kit",         ["es"]="Kit",         ["ru"]="Набор",      ["ar"]="طقم"      },
        };

        var units = await context.Units.Include(u => u.Translations).ToListAsync();
        bool hasChanges = false;

        foreach (var unit in units)
        {
            var code = unit.Code?.ToLowerInvariant();
            if (code is null || !translations.TryGetValue(code, out var langMap)) continue;

            foreach (var (lang, name) in langMap)
            {
                if (!unit.Translations.Any(t => t.LanguageCode == lang))
                {
                    unit.UpsertTranslation(lang, name);
                    hasChanges = true;
                }
            }
        }

        if (hasChanges)
            await context.SaveChangesAsync();
    }

    // ── Seed white-label demo branding data into StoreSettings ──────────────────
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
            StoreName = "Demo Store",
            ShowStoreNameInHeader = true,
            PrimaryColor = "#2C3E50",
            NavbarActiveColor = "#FFFFFF",
            FreeShippingBannerText = "FREE SHIPPING ON ORDERS OVER $100!",
            FreeShippingBannerVisible = true,
            FreeShippingBannerMarquee = false,
            FreeShippingBannerMarqueeSpeed = 5,
            BackgroundPatternBase64 = (string?)null,
            BackgroundPatternOpacity = 20,
            BackgroundColor = "#F5F6F7",
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
                        Id = "demo-slide-1",
                        ImageBase64 = (string?)null,
                        ImageUrl = (string?)null,
                        Title = "Welcome to Our Store",
                        Subtitle = "Quality Products, Fast Delivery",
                        Description = "Discover our wide range of products with reliable service and fast shipping.",
                        TextColor = "#FFFFFF",
                        OverlayColor = "#2C3E50",
                        OverlayOpacity = 88,
                        ButtonText = "Shop Now",
                        ButtonLink = "/products",
                        ButtonVisible = true,
                    },
                    new
                    {
                        Id = "demo-slide-2",
                        ImageBase64 = (string?)null,
                        ImageUrl = (string?)null,
                        Title = "Special Offers",
                        Subtitle = "Best prices guaranteed",
                        Description = "Explore our featured products and take advantage of exclusive deals.",
                        TextColor = "#FFFFFF",
                        OverlayColor = "#1A252F",
                        OverlayOpacity = 85,
                        ButtonText = "View Deals",
                        ButtonLink = "/products",
                        ButtonVisible = true,
                    },
                },
            },
            HomepageSections = new
            {
                Sections = new[]
                {
                    new
                    {
                        Id = "demo-categories",
                        Title = "Main Categories",
                        ShowTitle = false,
                        Layout = "grid",
                        Columns = 3,
                        BackgroundColor = "transparent",
                        PaddingY = 48,
                        Order = 0,
                        Enabled = true,
                        Cards = new[]
                        {
                            new { Id = "dcat-1", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/cat-a/400/300", Title = "CATEGORY A", Subtitle = "", Description = "", TextPosition = "bottom-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 30, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products?categoryId=1", ButtonText = (string?)null, ButtonVisible = false, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                            new { Id = "dcat-2", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/cat-b/400/300", Title = "CATEGORY B", Subtitle = "", Description = "", TextPosition = "bottom-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 30, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products?categoryId=2", ButtonText = (string?)null, ButtonVisible = false, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                            new { Id = "dcat-3", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/cat-c/400/300", Title = "CATEGORY C", Subtitle = "", Description = "", TextPosition = "bottom-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 30, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products?categoryId=3", ButtonText = (string?)null, ButtonVisible = false, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                        },
                    },
                    new
                    {
                        Id = "demo-featured",
                        Title = "Featured Products",
                        ShowTitle = false,
                        Layout = "featured",
                        Columns = 3,
                        BackgroundColor = "transparent",
                        PaddingY = 32,
                        Order = 1,
                        Enabled = true,
                        Cards = new[]
                        {
                            new { Id = "dfeat-1", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/featured-1/400/500", Title = "WEEKLY DEAL", Subtitle = "Special discounts on selected products", Description = "", TextPosition = "bottom-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 40, BadgeText = (string?)"Sale", BadgeColor = (string?)"#D4A853", BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products", ButtonText = (string?)"SHOP NOW", ButtonVisible = true, AspectRatio = "auto", ColSpan = 1, RowSpan = 1 },
                            new { Id = "dfeat-2", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/featured-2/400/300", Title = "NEW ARRIVALS", Subtitle = "Discover the latest additions to our collection.", Description = "", TextPosition = "center", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 40, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products", ButtonText = (string?)"EXPLORE", ButtonVisible = true, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                            new { Id = "dfeat-3", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/featured-3/400/200", Title = "BEST SELLERS", Subtitle = "Our most popular products.", Description = "", TextPosition = "top-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 35, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products", ButtonText = (string?)"SHOP NOW", ButtonVisible = true, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                            new { Id = "dfeat-4", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/featured-4/400/200", Title = "GIFTS", Subtitle = "Perfect gift ideas for your loved ones!", Description = "", TextPosition = "top-left", TextColor = "#FFFFFF", OverlayColor = "#000000", OverlayOpacity = 35, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products", ButtonText = (string?)"SHOP NOW", ButtonVisible = true, AspectRatio = "landscape", ColSpan = 1, RowSpan = 1 },
                        },
                    },
                    new
                    {
                        Id = "demo-satisfaction",
                        Title = "100% SATISFACTION GUARANTEE",
                        ShowTitle = true,
                        Layout = "banner",
                        Columns = 1,
                        BackgroundColor = "transparent",
                        PaddingY = 80,
                        Order = 2,
                        Enabled = true,
                        Cards = new[]
                        {
                            new { Id = "dbanner-1", ImageBase64 = (string?)null, ImageUrl = "https://picsum.photos/seed/banner-1/1920/600", Title = "100% SATISFACTION GUARANTEE", Subtitle = "", Description = "We are committed to providing the highest quality products and services. If you are not satisfied, we will make it right.", TextPosition = "center", TextColor = "#FFFFFF", OverlayColor = "#2C3E50", OverlayOpacity = 85, BadgeText = (string?)null, BadgeColor = (string?)null, BadgePosition = "top-left", LinkType = "url", LinkTarget = (string?)"/products", ButtonText = (string?)"LEARN MORE", ButtonVisible = true, AspectRatio = "auto", ColSpan = 1, RowSpan = 1 },
                        },
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
        // Resolve units
        var kgUnit = await context.Units.FirstOrDefaultAsync(u => u.Name == "Kilogram");
        var adetUnit = await context.Units.FirstOrDefaultAsync(u => u.Name == "Adet");
        var paketUnit = await context.Units.FirstOrDefaultAsync(u => u.Name == "Paket");
        if (kgUnit is null || adetUnit is null || paketUnit is null) return;

        // ── Categories ──────────────────────────────────────────────────────────────
        var categoryNames = new[] { "Kategori-A", "Kategori-B", "Kategori-C", "Kategori-D", "Kategori-E" };

        foreach (var catName in categoryNames)
        {
            if (!await context.Categories.AnyAsync(c => c.Name == catName))
                await context.Categories.AddAsync(Category.Create(catName));
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();

        // ── Products ─────────────────────────────────────────────────────────────────
        var catA = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kategori-A");
        var catB = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kategori-B");
        var catC = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kategori-C");
        var catD = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kategori-D");
        var catE = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kategori-E");

        var productDefs = new (string Name, string Desc, decimal Price, decimal Stock, Guid CategoryId, Guid UnitId, string ImageUrl)[]
        {
            ("Ürün-A1", "Kategori-A grubuna ait birinci ürün.", 12.99m, 100m, catA!.Id, kgUnit.Id, "https://picsum.photos/seed/product-a1/300/300"),
            ("Ürün-A2", "Kategori-A grubuna ait ikinci ürün.",  18.50m, 45m,  catA.Id,  kgUnit.Id, "https://picsum.photos/seed/product-a2/300/300"),
            ("Ürün-A3", "Kategori-A grubuna ait üçüncü ürün.",  24.99m, 60m,  catA.Id,  kgUnit.Id, "https://picsum.photos/seed/product-a3/300/300"),
            ("Ürün-B1", "Kategori-B grubuna ait birinci ürün.", 9.99m,  80m,  catB!.Id, adetUnit.Id, "https://picsum.photos/seed/product-b1/300/300"),
            ("Ürün-B2", "Kategori-B grubuna ait ikinci ürün.",  15.00m, 8m,   catB.Id,  adetUnit.Id, "https://picsum.photos/seed/product-b2/300/300"),
            ("Ürün-C1", "Kategori-C grubuna ait birinci ürün.", 22.50m, 60m,  catC!.Id, kgUnit.Id, "https://picsum.photos/seed/product-c1/300/300"),
            ("Ürün-C2", "Kategori-C grubuna ait ikinci ürün.",  14.99m, 150m, catC.Id,  kgUnit.Id, "https://picsum.photos/seed/product-c2/300/300"),
            ("Ürün-C3", "Kategori-C grubuna ait üçüncü ürün.",  19.50m, 0m,   catC.Id,  kgUnit.Id, "https://picsum.photos/seed/product-c3/300/300"),
            ("Ürün-D1", "Kategori-D grubuna ait birinci ürün.", 29.99m, 35m,  catD!.Id, adetUnit.Id, "https://picsum.photos/seed/product-d1/300/300"),
            ("Ürün-D2", "Kategori-D grubuna ait ikinci ürün.",  39.99m, 25m,  catD.Id,  adetUnit.Id, "https://picsum.photos/seed/product-d2/300/300"),
            ("Ürün-E1", "Kategori-E grubuna ait birinci ürün.", 16.99m, 70m,  catE!.Id, kgUnit.Id, "https://picsum.photos/seed/product-e1/300/300"),
            ("Ürün-E2", "Kategori-E grubuna ait ikinci ürün.",  11.50m, 3m,   catE.Id,  adetUnit.Id, "https://picsum.photos/seed/product-e2/300/300"),
            ("Ürün-E3", "Kategori-E grubuna ait üçüncü ürün.",  34.99m, 15m,  catE.Id,  paketUnit.Id, "https://picsum.photos/seed/product-e3/300/300"),
        };

        foreach (var p in productDefs)
        {
            if (!await context.Products.AnyAsync(x => x.Name == p.Name))
            {
                await context.Products.AddAsync(Product.Create(
                    p.Name, p.Desc, p.ImageUrl,
                    new Money(p.Price, Currency.USD),
                    new StockQuantity(p.Stock),
                    p.CategoryId,
                    p.UnitId));
            }
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();

        await SeedTranslationsAsync(context);
    }

    // ── Dev-only translation seed — provides all 7 language translations ──
    // Language-agnostic architecture: all languages live in the translations table.
    private static async Task SeedTranslationsAsync(ApplicationDbContext context)
    {
        // ── Category Translations (5 categories × 7 languages) ─────────────────────
        var catTrans = new (string Name, string Lang, string Translated)[]
        {
            // TR
            ("Kategori-A", "tr", "Kategori-A"), ("Kategori-B", "tr", "Kategori-B"), ("Kategori-C", "tr", "Kategori-C"), ("Kategori-D", "tr", "Kategori-D"), ("Kategori-E", "tr", "Kategori-E"),
            // EN
            ("Kategori-A", "en", "Category-A"), ("Kategori-B", "en", "Category-B"), ("Kategori-C", "en", "Category-C"), ("Kategori-D", "en", "Category-D"), ("Kategori-E", "en", "Category-E"),
            // DE
            ("Kategori-A", "de", "Kategorie-A"), ("Kategori-B", "de", "Kategorie-B"), ("Kategori-C", "de", "Kategorie-C"), ("Kategori-D", "de", "Kategorie-D"), ("Kategori-E", "de", "Kategorie-E"),
            // FR
            ("Kategori-A", "fr", "Catégorie-A"), ("Kategori-B", "fr", "Catégorie-B"), ("Kategori-C", "fr", "Catégorie-C"), ("Kategori-D", "fr", "Catégorie-D"), ("Kategori-E", "fr", "Catégorie-E"),
            // ES
            ("Kategori-A", "es", "Categoría-A"), ("Kategori-B", "es", "Categoría-B"), ("Kategori-C", "es", "Categoría-C"), ("Kategori-D", "es", "Categoría-D"), ("Kategori-E", "es", "Categoría-E"),
            // RU
            ("Kategori-A", "ru", "Категория-A"), ("Kategori-B", "ru", "Категория-B"), ("Kategori-C", "ru", "Категория-C"), ("Kategori-D", "ru", "Категория-D"), ("Kategori-E", "ru", "Категория-E"),
            // AR
            ("Kategori-A", "ar", "الفئة-أ"), ("Kategori-B", "ar", "الفئة-ب"), ("Kategori-C", "ar", "الفئة-ج"), ("Kategori-D", "ar", "الفئة-د"), ("Kategori-E", "ar", "الفئة-ه"),
        };

        foreach (var (categoryName, lang, translatedName) in catTrans)
        {
            var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
            if (category is null) continue;

            var exists = await context.CategoryTranslations.AnyAsync(t => t.CategoryId == category.Id && t.LanguageCode == lang);
            if (exists) continue;

            await context.CategoryTranslations.AddAsync(CategoryTranslation.Create(category.Id, lang, translatedName, null));
        }

        // ── Product Translations (13 products × 7 languages) ───────────────────────
        var prodTrans = new (string Name, string Lang, string TransName, string TransDesc)[]
        {
            // TR
            ("Ürün-A1", "tr", "Ürün-A1", "Kategori-A grubuna ait birinci ürün."),
            ("Ürün-A2", "tr", "Ürün-A2", "Kategori-A grubuna ait ikinci ürün."),
            ("Ürün-A3", "tr", "Ürün-A3", "Kategori-A grubuna ait üçüncü ürün."),
            ("Ürün-B1", "tr", "Ürün-B1", "Kategori-B grubuna ait birinci ürün."),
            ("Ürün-B2", "tr", "Ürün-B2", "Kategori-B grubuna ait ikinci ürün."),
            ("Ürün-C1", "tr", "Ürün-C1", "Kategori-C grubuna ait birinci ürün."),
            ("Ürün-C2", "tr", "Ürün-C2", "Kategori-C grubuna ait ikinci ürün."),
            ("Ürün-C3", "tr", "Ürün-C3", "Kategori-C grubuna ait üçüncü ürün."),
            ("Ürün-D1", "tr", "Ürün-D1", "Kategori-D grubuna ait birinci ürün."),
            ("Ürün-D2", "tr", "Ürün-D2", "Kategori-D grubuna ait ikinci ürün."),
            ("Ürün-E1", "tr", "Ürün-E1", "Kategori-E grubuna ait birinci ürün."),
            ("Ürün-E2", "tr", "Ürün-E2", "Kategori-E grubuna ait ikinci ürün."),
            ("Ürün-E3", "tr", "Ürün-E3", "Kategori-E grubuna ait üçüncü ürün."),
            // EN
            ("Ürün-A1", "en", "Product-A1", "First product in Category-A group."),
            ("Ürün-A2", "en", "Product-A2", "Second product in Category-A group."),
            ("Ürün-A3", "en", "Product-A3", "Third product in Category-A group."),
            ("Ürün-B1", "en", "Product-B1", "First product in Category-B group."),
            ("Ürün-B2", "en", "Product-B2", "Second product in Category-B group."),
            ("Ürün-C1", "en", "Product-C1", "First product in Category-C group."),
            ("Ürün-C2", "en", "Product-C2", "Second product in Category-C group."),
            ("Ürün-C3", "en", "Product-C3", "Third product in Category-C group."),
            ("Ürün-D1", "en", "Product-D1", "First product in Category-D group."),
            ("Ürün-D2", "en", "Product-D2", "Second product in Category-D group."),
            ("Ürün-E1", "en", "Product-E1", "First product in Category-E group."),
            ("Ürün-E2", "en", "Product-E2", "Second product in Category-E group."),
            ("Ürün-E3", "en", "Product-E3", "Third product in Category-E group."),
            // DE
            ("Ürün-A1", "de", "Produkt-A1", "Erstes Produkt der Kategorie-A."),
            ("Ürün-A2", "de", "Produkt-A2", "Zweites Produkt der Kategorie-A."),
            ("Ürün-A3", "de", "Produkt-A3", "Drittes Produkt der Kategorie-A."),
            ("Ürün-B1", "de", "Produkt-B1", "Erstes Produkt der Kategorie-B."),
            ("Ürün-B2", "de", "Produkt-B2", "Zweites Produkt der Kategorie-B."),
            ("Ürün-C1", "de", "Produkt-C1", "Erstes Produkt der Kategorie-C."),
            ("Ürün-C2", "de", "Produkt-C2", "Zweites Produkt der Kategorie-C."),
            ("Ürün-C3", "de", "Produkt-C3", "Drittes Produkt der Kategorie-C."),
            ("Ürün-D1", "de", "Produkt-D1", "Erstes Produkt der Kategorie-D."),
            ("Ürün-D2", "de", "Produkt-D2", "Zweites Produkt der Kategorie-D."),
            ("Ürün-E1", "de", "Produkt-E1", "Erstes Produkt der Kategorie-E."),
            ("Ürün-E2", "de", "Produkt-E2", "Zweites Produkt der Kategorie-E."),
            ("Ürün-E3", "de", "Produkt-E3", "Drittes Produkt der Kategorie-E."),
            // FR
            ("Ürün-A1", "fr", "Produit-A1", "Premier produit du groupe Catégorie-A."),
            ("Ürün-A2", "fr", "Produit-A2", "Deuxième produit du groupe Catégorie-A."),
            ("Ürün-A3", "fr", "Produit-A3", "Troisième produit du groupe Catégorie-A."),
            ("Ürün-B1", "fr", "Produit-B1", "Premier produit du groupe Catégorie-B."),
            ("Ürün-B2", "fr", "Produit-B2", "Deuxième produit du groupe Catégorie-B."),
            ("Ürün-C1", "fr", "Produit-C1", "Premier produit du groupe Catégorie-C."),
            ("Ürün-C2", "fr", "Produit-C2", "Deuxième produit du groupe Catégorie-C."),
            ("Ürün-C3", "fr", "Produit-C3", "Troisième produit du groupe Catégorie-C."),
            ("Ürün-D1", "fr", "Produit-D1", "Premier produit du groupe Catégorie-D."),
            ("Ürün-D2", "fr", "Produit-D2", "Deuxième produit du groupe Catégorie-D."),
            ("Ürün-E1", "fr", "Produit-E1", "Premier produit du groupe Catégorie-E."),
            ("Ürün-E2", "fr", "Produit-E2", "Deuxième produit du groupe Catégorie-E."),
            ("Ürün-E3", "fr", "Produit-E3", "Troisième produit du groupe Catégorie-E."),
            // ES
            ("Ürün-A1", "es", "Producto-A1", "Primer producto del grupo Categoría-A."),
            ("Ürün-A2", "es", "Producto-A2", "Segundo producto del grupo Categoría-A."),
            ("Ürün-A3", "es", "Producto-A3", "Tercer producto del grupo Categoría-A."),
            ("Ürün-B1", "es", "Producto-B1", "Primer producto del grupo Categoría-B."),
            ("Ürün-B2", "es", "Producto-B2", "Segundo producto del grupo Categoría-B."),
            ("Ürün-C1", "es", "Producto-C1", "Primer producto del grupo Categoría-C."),
            ("Ürün-C2", "es", "Producto-C2", "Segundo producto del grupo Categoría-C."),
            ("Ürün-C3", "es", "Producto-C3", "Tercer producto del grupo Categoría-C."),
            ("Ürün-D1", "es", "Producto-D1", "Primer producto del grupo Categoría-D."),
            ("Ürün-D2", "es", "Producto-D2", "Segundo producto del grupo Categoría-D."),
            ("Ürün-E1", "es", "Producto-E1", "Primer producto del grupo Categoría-E."),
            ("Ürün-E2", "es", "Producto-E2", "Segundo producto del grupo Categoría-E."),
            ("Ürün-E3", "es", "Producto-E3", "Tercer producto del grupo Categoría-E."),
            // RU
            ("Ürün-A1", "ru", "Продукт-A1", "Первый продукт группы Категория-A."),
            ("Ürün-A2", "ru", "Продукт-A2", "Второй продукт группы Категория-A."),
            ("Ürün-A3", "ru", "Продукт-A3", "Третий продукт группы Категория-A."),
            ("Ürün-B1", "ru", "Продукт-B1", "Первый продукт группы Категория-B."),
            ("Ürün-B2", "ru", "Продукт-B2", "Второй продукт группы Категория-B."),
            ("Ürün-C1", "ru", "Продукт-C1", "Первый продукт группы Категория-C."),
            ("Ürün-C2", "ru", "Продукт-C2", "Второй продукт группы Категория-C."),
            ("Ürün-C3", "ru", "Продукт-C3", "Третий продукт группы Категория-C."),
            ("Ürün-D1", "ru", "Продукт-D1", "Первый продукт группы Категория-D."),
            ("Ürün-D2", "ru", "Продукт-D2", "Второй продукт группы Категория-D."),
            ("Ürün-E1", "ru", "Продукт-E1", "Первый продукт группы Категория-E."),
            ("Ürün-E2", "ru", "Продукт-E2", "Второй продукт группы Категория-E."),
            ("Ürün-E3", "ru", "Продукт-E3", "Третий продукт группы Категория-E."),
            // AR
            ("Ürün-A1", "ar", "المنتج-أ1", "المنتج الأول في مجموعة الفئة-أ."),
            ("Ürün-A2", "ar", "المنتج-أ2", "المنتج الثاني في مجموعة الفئة-أ."),
            ("Ürün-A3", "ar", "المنتج-أ3", "المنتج الثالث في مجموعة الفئة-أ."),
            ("Ürün-B1", "ar", "المنتج-ب1", "المنتج الأول في مجموعة الفئة-ب."),
            ("Ürün-B2", "ar", "المنتج-ب2", "المنتج الثاني في مجموعة الفئة-ب."),
            ("Ürün-C1", "ar", "المنتج-ج1", "المنتج الأول في مجموعة الفئة-ج."),
            ("Ürün-C2", "ar", "المنتج-ج2", "المنتج الثاني في مجموعة الفئة-ج."),
            ("Ürün-C3", "ar", "المنتج-ج3", "المنتج الثالث في مجموعة الفئة-ج."),
            ("Ürün-D1", "ar", "المنتج-د1", "المنتج الأول في مجموعة الفئة-د."),
            ("Ürün-D2", "ar", "المنتج-د2", "المنتج الثاني في مجموعة الفئة-د."),
            ("Ürün-E1", "ar", "المنتج-ه1", "المنتج الأول في مجموعة الفئة-ه."),
            ("Ürün-E2", "ar", "المنتج-ه2", "المنتج الثاني في مجموعة الفئة-ه."),
            ("Ürün-E3", "ar", "المنتج-ه3", "المنتج الثالث في مجموعة الفئة-ه."),
        };

        foreach (var (productName, lang, translatedName, translatedDesc) in prodTrans)
        {
            var product = await context.Products.FirstOrDefaultAsync(p => p.Name == productName);
            if (product is null) continue;

            var exists = await context.ProductTranslations.AnyAsync(t => t.ProductId == product.Id && t.LanguageCode == lang);
            if (exists) continue;

            await context.ProductTranslations.AddAsync(ProductTranslation.Create(product.Id, lang, translatedName, translatedDesc));
        }

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
