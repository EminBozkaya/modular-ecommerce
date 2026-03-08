using MediatR;

namespace ECommerce.Application.Catalog.Commands;

// --- CreateProduct ---
public record CreateProductCommand(
    string Name,
    string? Description,
    string? ImageUrl,
    decimal Price,
    string Currency,
    int StockQuantity,
    Guid CategoryId,
    Guid UnitId,
    bool IsActive = true) : IRequest<Guid>;

// --- UpdateProduct ---
public record UpdateProductCommand(
    Guid Id,
    string Name,
    string? Description,
    string? ImageUrl,
    decimal Price,
    string Currency,
    Guid CategoryId,
    Guid UnitId,
    bool IsActive) : IRequest;

// --- DeleteProduct ---
public record DeleteProductCommand(Guid Id) : IRequest;

// --- RestoreProduct ---
public record RestoreProductCommand(Guid Id) : IRequest;

// --- UpdateStock ---
public record UpdateStockCommand(Guid ProductId, int NewQuantity) : IRequest;

// --- CreateCategory ---
public record CreateCategoryCommand(
    string Name,
    string? Description,
    string? ImageUrl,
    bool IsActive = true,
    Guid? ParentCategoryId = null) : IRequest<Guid>;

// --- UpdateCategory ---
public record UpdateCategoryCommand(
    Guid Id,
    string Name,
    string? Description,
    string? ImageUrl,
    bool IsActive,
    Guid? ParentCategoryId) : IRequest;

// --- DeleteCategory ---
public record DeleteCategoryCommand(Guid Id) : IRequest;

// --- RestoreCategory ---
public record RestoreCategoryCommand(Guid Id) : IRequest;
