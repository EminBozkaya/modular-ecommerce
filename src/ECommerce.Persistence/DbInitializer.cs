using ECommerce.Domain.Catalog.Entities;
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
    }
}
