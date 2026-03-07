namespace ECommerce.Application.Common.Models;

public record SortingParams
{
    public string? SortBy { get; init; }
    public bool Descending { get; init; }
}
