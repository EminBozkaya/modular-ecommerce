using ECommerce.Domain.Common;
using ECommerce.Domain.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace ECommerce.Persistence.Interceptors;

/// <summary>
/// Intercepts SaveChanges to apply audit fields and soft-delete.
/// backend-rules §3: Soft delete is mandatory.
/// </summary>
public class AuditAndSoftDeleteInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUserService;

    public AuditAndSoftDeleteInterceptor(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

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

    private void ApplyAudit(DbContext? ctx)
    {
        if (ctx is null) return;
        var now = DateTime.UtcNow;
        var userId = _currentUserService.UserId;

        foreach (var entry in ctx.ChangeTracker.Entries<BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = userId;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;

                case EntityState.Deleted:
                    // Convert hard-delete to soft-delete
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = now;
                    // Note: DeletedBy is not in BaseAuditableEntity currently, but user asked for it in UI.
                    // Let me check BaseAuditableEntity again.
                    break;
            }
        }
    }
}
