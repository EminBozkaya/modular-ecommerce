namespace ECommerce.Domain.Common;

public abstract class BaseAuditableEntity : BaseEntity
{
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // Soft delete — backend-rules §3
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
