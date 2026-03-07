using ECommerce.Application.Common.Caching;
using ECommerce.Domain.Catalog;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Catalog.ValueObjects;
using MediatR;

namespace ECommerce.Application.Catalog.Commands;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public CreateProductHandler(IProductRepository products, ICacheService cacheService)
    {
        _products = products;
        _cacheService = cacheService;
    }

    public async Task<Guid> Handle(CreateProductCommand cmd, CancellationToken ct)
    {
        var product = Product.Create(cmd.Name, cmd.Description, cmd.ImageUrl,
            new Money(cmd.Price, cmd.Currency), new StockQuantity(cmd.StockQuantity), cmd.CategoryId);
        await _products.AddAsync(product, ct);
        await _products.SaveChangesAsync(ct);
        await _cacheService.RemoveByPrefixAsync("catalog", ct);
        return product.Id;
    }
}

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _products;
    private readonly ICacheService _cacheService;

    public UpdateProductHandler(IProductRepository products, ICacheService cacheService)
    {
        _products = products;
        _cacheService = cacheService;
    }

    public async Task Handle(UpdateProductCommand cmd, CancellationToken ct)
    {
        var product = await _products.GetByIdAsync(cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Product {cmd.Id} not found.");
        product.UpdateDetails(cmd.Name, cmd.Description, cmd.ImageUrl,
            new Money(cmd.Price, cmd.Currency), cmd.CategoryId);
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
        product.Deactivate();
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
    public CreateCategoryHandler(ICategoryRepository categories) => _categories = categories;

    public async Task<Guid> Handle(CreateCategoryCommand cmd, CancellationToken ct)
    {
        var category = Category.Create(cmd.Name, cmd.Description, cmd.ImageUrl);
        await _categories.AddAsync(category, ct);
        await _categories.SaveChangesAsync(ct);
        return category.Id;
    }
}
