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
    Guid CategoryId) : IRequest<Guid>;

// --- UpdateProduct ---
public record UpdateProductCommand(
    Guid Id,
    string Name,
    string? Description,
    string? ImageUrl,
    decimal Price,
    string Currency,
    Guid CategoryId) : IRequest;

// --- DeleteProduct ---
public record DeleteProductCommand(Guid Id) : IRequest;

// --- UpdateStock ---
public record UpdateStockCommand(Guid ProductId, int NewQuantity) : IRequest;

// --- CreateCategory ---
public record CreateCategoryCommand(
    string Name,
    string? Description,
    string? ImageUrl) : IRequest<Guid>;
