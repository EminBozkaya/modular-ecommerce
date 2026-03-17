using ECommerce.Domain.Common;

namespace ECommerce.Domain.Identity.Entities;

public class ExternalLogin : BaseAuditableEntity
{
    public Guid UserId { get; private set; }
    public string Provider { get; private set; } = default!;
    public string ProviderUserId { get; private set; } = default!;
    public AppUser User { get; private set; } = default!;

    private ExternalLogin() { } // EF Core

    public static ExternalLogin Create(Guid userId, string provider, string providerUserId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(provider);
        ArgumentException.ThrowIfNullOrWhiteSpace(providerUserId);

        return new ExternalLogin
        {
            UserId = userId,
            Provider = provider,
            ProviderUserId = providerUserId,
            CreatedAt = DateTime.UtcNow
        };
    }
}
