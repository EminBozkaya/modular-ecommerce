using ECommerce.Domain.Identity;

namespace ECommerce.Infrastructure.Identity.SocialAuth;

/// <summary>
/// Aktif sosyal provider'ları yönetir ve isimle erişim sağlar.
/// IEnumerable&lt;ISocialAuthProvider&gt; DI pattern kullanır.
/// </summary>
public sealed class SocialAuthProviderResolver
{
    private readonly IEnumerable<ISocialAuthProvider> _providers;

    public SocialAuthProviderResolver(IEnumerable<ISocialAuthProvider> providers)
    {
        _providers = providers;
    }

    /// <summary>Aktif tüm provider'ları döndürür.</summary>
    public IReadOnlyList<ISocialAuthProvider> GetActiveProviders()
        => _providers.Where(p => p.IsActive).ToList();

    /// <summary>
    /// Belirtilen provider'ı döndürür.
    /// Bulunamazsa veya aktif değilse InvalidOperationException fırlatır.
    /// </summary>
    public ISocialAuthProvider GetProvider(string providerName)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            throw new InvalidOperationException($"Social auth provider '{providerName}' not found.");
        if (!provider.IsActive)
            throw new InvalidOperationException($"Social auth provider '{providerName}' is currently disabled.");

        return provider;
    }
}
