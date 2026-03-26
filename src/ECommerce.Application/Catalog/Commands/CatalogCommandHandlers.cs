using ECommerce.Application.Common.Caching;
using ECommerce.Application.Common.Settings;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ECommerce.Application.Catalog.Commands;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;
    private readonly string _defaultLanguage;

    public CreateProductHandler(IProductRepository products, ICacheService cacheService, IOptions<LocalizationOptions> locOptions)
    {
        _products = products;
        _cacheService = cacheService;
        _defaultLanguage = locOptions.Value.DefaultLanguage;
    }

    public async Task<Guid> Handle(CreateProductCommand cmd, CancellationToken ct)
    {
        var existingProducts = await _products.SearchAsync(
            new ProductFilterCriteria(cmd.Name, null, null, null, null, false, 1, 10, IncludeInactive: true), ct);
        var exactMatch = existingProducts.FirstOrDefault(p => p.Name.Trim().Equals(cmd.Name.Trim(), StringComparison.OrdinalIgnoreCase));

        if (exactMatch != null)
        {
            if (!exactMatch.IsDeleted)
            {
                throw new InvalidOperationException($"'{cmd.Name}' isminde aktif bir ürün zaten var.");
            }
            // If deleted, we could return a specific error to trigger the UI modal,
            // but for now let's just allow it or throw a specific exception that frontend can catch.
            // Based on discussion, frontend will catch "Duplicate archived" error.
            throw new InvalidOperationException($"ARCHIVED_DUPLICATE|{exactMatch.Id}|{exactMatch.Name}");
        }

        var product = Product.Create(cmd.Name, cmd.Description, cmd.ImageUrl,
            new Money(cmd.Price, cmd.Currency), new StockQuantity(cmd.StockQuantity), cmd.CategoryId, cmd.UnitId, cmd.IsActive);
        await _products.AddAsync(product, ct);
        await _products.SaveChangesAsync(ct);

        // Write DefaultLanguage translation row — language-agnostic architecture requires all
        // languages including the default to live in the translations table.
        product.UpsertTranslation(_defaultLanguage, cmd.Name, cmd.Description);
        await _products.SaveChangesAsync(ct);

        await _cacheService.RemoveByPrefixAsync("catalog", ct);
        return product.Id;
    }
}

public class RestoreProductHandler : IRequestHandler<RestoreProductCommand>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public RestoreProductHandler(IProductRepository products, ICacheService cacheService)
    {
        _products = products;
        _cacheService = cacheService;
    }

    public async Task Handle(RestoreProductCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.Id, ct) // Note: Repository might need update to ignore filters or we use a spec
            ?? throw new KeyNotFoundException($"Product {cmd.Id} not found.");
        product.Restore();
        await _products.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;
    private readonly ILogger<UpdateProductHandler> _logger;
    private readonly string _defaultLanguage;

    public UpdateProductHandler(IProductRepository products, ICacheService cacheService, ILogger<UpdateProductHandler> logger, IOptions<LocalizationOptions> locOptions)
    {
        _products = products;
        _cacheService = cacheService;
        _logger = logger;
        _defaultLanguage = locOptions.Value.DefaultLanguage;
    }

    public async Task Handle(UpdateProductCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Product {cmd.Id} not found.");

        _logger.LogInformation("Updating product {Id}: Name={Name}, IsActive={IsActive}", cmd.Id, cmd.Name, cmd.IsActive);

        product.UpdateDetails(cmd.Name, cmd.Description, cmd.ImageUrl,
            new Money(cmd.Price, cmd.Currency), cmd.CategoryId, cmd.UnitId, cmd.IsActive);

        // Keep DefaultLanguage translation in sync with the canonical entity name.
        // The admin "Genel" tab always edits in the DefaultLanguage.
        product.UpsertTranslation(_defaultLanguage, cmd.Name, cmd.Description);

        await _products.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public DeleteProductHandler(IProductRepository products, ICacheService cacheService)
    {
        _products = products;
        _cacheService = cacheService;
    }

    public async Task Handle(DeleteProductCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Product {cmd.Id} not found.");
        product.SoftDelete();
        await _products.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class UpdateStockHandler : IRequestHandler<UpdateStockCommand>
{
    private readonly IProductRepository _products;
    public UpdateStockHandler(IProductRepository products) => _products = products;

    public async Task Handle(UpdateStockCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException($"Product {cmd.ProductId} not found.");
        product.UpdateStock(cmd.NewQuantity);
        await _products.SaveChangesAsync(ct);
    }
}

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly ICategoryRepository _categories;
    private readonly ICacheService _cacheService;
    private readonly string _defaultLanguage;

    public CreateCategoryHandler(ICategoryRepository categories, ICacheService cacheService, IOptions<LocalizationOptions> locOptions)
    {
        _categories = categories;
        _cacheService = cacheService;
        _defaultLanguage = locOptions.Value.DefaultLanguage;
    }

    public async Task<Guid> Handle(CreateCategoryCommand cmd, CancellationToken ct)
    {
        var allCats = await _categories.GetAllAsync(includeDeleted: true, ct: ct);
        var exactMatch = allCats.FirstOrDefault(c => c.Name.Trim().Equals(cmd.Name.Trim(), StringComparison.OrdinalIgnoreCase));

        if (exactMatch != null)
        {
            if (!exactMatch.IsDeleted)
            {
                throw new InvalidOperationException($"'{cmd.Name}' isminde aktif bir kategori zaten var.");
            }
            throw new InvalidOperationException($"ARCHIVED_DUPLICATE|{exactMatch.Id}|{exactMatch.Name}");
        }

        var category = Category.Create(cmd.Name, cmd.Description, cmd.ImageUrl, cmd.IsActive, cmd.ParentCategoryId);
        await _categories.AddAsync(category, ct);
        await _categories.SaveChangesAsync(ct);

        // Write DefaultLanguage translation row — language-agnostic architecture.
        category.UpsertTranslation(_defaultLanguage, cmd.Name, cmd.Description);
        _categories.Update(category);
        await _categories.SaveChangesAsync(ct);

        await _cacheService.RemoveByPrefixAsync("catalog", ct);
        return category.Id;
    }
}

public class RestoreCategoryHandler : IRequestHandler<RestoreCategoryCommand>
{
    private readonly ICategoryRepository _categories;
    private readonly ICacheService _cacheService;
    public RestoreCategoryHandler(ICategoryRepository categories, ICacheService cacheService)
    {
        _categories = categories;
        _cacheService = cacheService;
    }

    public async Task Handle(RestoreCategoryCommand cmd, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Category {cmd.Id} not found.");
        category.Restore();
        _categories.Update(category);
        await _categories.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand>
{
    private readonly ICategoryRepository _categories;
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;
    private readonly ILogger<UpdateCategoryHandler> _logger;
    private readonly string _defaultLanguage;

    public UpdateCategoryHandler(ICategoryRepository categories, IProductRepository products, ICacheService cacheService, ILogger<UpdateCategoryHandler> logger, IOptions<LocalizationOptions> locOptions)
    {
        _categories = categories;
        _products = products;
        _cacheService = cacheService;
        _logger = logger;
        _defaultLanguage = locOptions.Value.DefaultLanguage;
    }

    public async Task Handle(UpdateCategoryCommand cmd, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Category {cmd.Id} not found.");

        _logger.LogInformation("Updating category {Id}: Name={Name}, IsActive={IsActive}", cmd.Id, cmd.Name, cmd.IsActive);

        category.Update(cmd.Name, cmd.Description, cmd.ImageUrl, cmd.IsActive, cmd.ParentCategoryId);

        // Keep DefaultLanguage translation in sync with the canonical entity name.
        category.UpsertTranslation(_defaultLanguage, cmd.Name, cmd.Description);

        _categories.Update(category);
        await _categories.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly ICategoryRepository _categories;
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public DeleteCategoryHandler(ICategoryRepository categories, IProductRepository products, ICacheService cacheService)
    {
        _categories = categories;
        _products = products;
        _cacheService = cacheService;
    }

    public async Task Handle(DeleteCategoryCommand cmd, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Category {cmd.Id} not found.");

        if (category.ParentCategoryId == null)
        {
            // --- ROOT CATEGORY DELETION SCENARIOS ---
            var allSubCategories = category.SubCategories.Where(c => !c.IsDeleted).ToList();
            var allCategoryIdsToCheck = new List<Guid> { category.Id };
            allCategoryIdsToCheck.AddRange(allSubCategories.Select(c => c.Id));

            var spec = new ProductsByCategoriesSpec(allCategoryIdsToCheck);
            var productsInTree = await _products.ListAsync(spec, ct);

            if (productsInTree.Any())
            {
                // Scenario 3: Only 1 SubCategory, and it has products. Root has no products.
                bool rootHasProducts = productsInTree.Any(p => p.CategoryId == category.Id);
                var subCategoriesWithProducts = allSubCategories.Where(subCat =>
                    productsInTree.Any(p => p.CategoryId == subCat.Id)
                ).ToList();

                if (!rootHasProducts && allSubCategories.Count == 1 && subCategoriesWithProducts.Count == 1)
                {
                    // Promote the single subcategory to Root
                    var subCatToPromote = subCategoriesWithProducts.First();
                    subCatToPromote.Update(subCatToPromote.Name, subCatToPromote.Description, subCatToPromote.ImageUrl, subCatToPromote.IsActive, null); // ParentId = null
                    _categories.Update(subCatToPromote);

                    // Then delete the empty root
                    category.SoftDelete();
                    _categories.Update(category);
                }
                else
                {
                    // Scenario 1 & 4: Products exist, either in root or in multiple subcategories. Block deletion.
                    throw new InvalidOperationException($"Cannot delete Root Category '{category.Name}' because it or its subcategories contain active products.");
                }
            }
            else
            {
                // Scenario 2: Empty tree (no products in root or any subcategories)
                foreach(var subCat in allSubCategories)
                {
                    subCat.SoftDelete();
                    _categories.Update(subCat);
                }
                category.SoftDelete();
                _categories.Update(category);
            }
        }
        else
        {
            // Subcategory deletion fallback logic
            var spec = new ProductsByCategoriesSpec(new List<Guid> { category.Id });
            var productCount = await _products.CountAsync(spec, ct);

            if (productCount > 0)
                throw new InvalidOperationException($"Cannot delete category '{category.Name}' because it has {productCount} active products.");

            category.SoftDelete();
            _categories.Update(category);
        }

        await _categories.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class UpsertProductTranslationHandler : IRequestHandler<UpsertProductTranslationCommand>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public UpsertProductTranslationHandler(IProductRepository products, ICacheService cacheService)
    {
        _products = products;
        _cacheService = cacheService;
    }

    public async Task Handle(UpsertProductTranslationCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException($"Product {cmd.ProductId} not found.");
        product.UpsertTranslation(cmd.LanguageCode, cmd.Name, cmd.Description);
        await _products.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class UpsertCategoryTranslationHandler : IRequestHandler<UpsertCategoryTranslationCommand>
{
    private readonly ICategoryRepository _categories;
    private readonly ICacheService _cacheService;

    public UpsertCategoryTranslationHandler(ICategoryRepository categories, ICacheService cacheService)
    {
        _categories = categories;
        _cacheService = cacheService;
    }

    public async Task Handle(UpsertCategoryTranslationCommand cmd, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(cmd.CategoryId, ct)
            ?? throw new KeyNotFoundException($"Category {cmd.CategoryId} not found.");
        category.UpsertTranslation(cmd.LanguageCode, cmd.Name, cmd.Description);
        _categories.Update(category);
        await _categories.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}

public class ReorderCategoriesHandler : IRequestHandler<ReorderCategoriesCommand>
{
    private readonly ICategoryRepository _categories;
    private readonly ICacheService _cacheService;

    public ReorderCategoriesHandler(ICategoryRepository categories, ICacheService cacheService)
    {
        _categories = categories;
        _cacheService = cacheService;
    }

    public async Task Handle(ReorderCategoriesCommand cmd, CancellationToken ct)
    {
        // Load all categories in a single query to avoid N+1
        var all = await _categories.GetAllAsync(includeDeleted: false, onlyMain: false, ct);
        var lookup = all.ToDictionary(c => c.Id);

        foreach (var item in cmd.Items)
        {
            if (lookup.TryGetValue(item.CategoryId, out var category))
            {
                category.SetDisplayOrder(item.DisplayOrder);
                _categories.Update(category);
            }
        }

        await _categories.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
    }
}
