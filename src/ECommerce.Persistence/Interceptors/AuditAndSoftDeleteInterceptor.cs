using ECommerce.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace ECommerce.Persistence.Interceptors;

/// <summary>
/// Intercepts SaveChanges to apply audit fields and soft-delete.
/// backend-rules §3: Soft delete is mandatory.
/// </summary>
public class AuditAndSoftDeleteInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData, InterceptionResult<int> result)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, InterceptionResult<int> result, CancellationToken ct = default)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChangesAsync(eventData, result, ct);
    }

    private static void ApplyAudit(DbContext? ctx)
    {
        if (ctx is null) return;
        var now = DateTime.UtcNow;

        foreach (var entry in ctx.ChangeTracker.Entries<BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    break;

                case EntityState.Deleted:
                    // Convert hard-delete to soft-delete
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = now;
                    break;
            }
        }
    }
}
