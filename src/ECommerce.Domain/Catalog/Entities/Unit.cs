using ECommerce.Domain.Common;

namespace ECommerce.Domain.Catalog.Entities;

public class Unit : BaseAuditableEntity
{
    public string Name { get; private set; } = default!;
    public string? Code { get; private set; }

    private Unit() { }

    public static Unit Create(string name, string? code = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new Unit
        {
            Name = name,
            Code = code,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? code = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
        Code = code;
        UpdatedAt = DateTime.UtcNow;
    }
}
