using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;

namespace ECommerce.Infrastructure.Payment;

/// <summary>
/// Aktif provider'ları yönetir ve isimle erişim sağlar.
/// IEnumerable&lt;IPaymentProvider&gt; DI pattern — factory gerekmez.
/// </summary>
public sealed class PaymentProviderResolver
{
    private readonly IEnumerable<IPaymentProvider> _providers;

    public PaymentProviderResolver(IEnumerable<IPaymentProvider> providers)
    {
        _providers = providers;
    }

    /// <summary>Aktif ve yapılandırması geçerli tüm provider'ları döndürür.</summary>
    public IReadOnlyList<IPaymentProvider> GetActiveProviders()
        => _providers.Where(p => p.IsActive).ToList();

    /// <summary>
    /// Belirtilen provider'ı döndürür.
    /// Bulunamazsa veya aktif değilse InvalidOperationException fırlatır.
    /// </summary>
    public IPaymentProvider GetProvider(string providerName)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            throw new InvalidOperationException($"Payment provider '{providerName}' not found.");
        if (!provider.IsActive)
            throw new InvalidOperationException($"Payment provider '{providerName}' is currently disabled.");

        return provider;
    }

    /// <summary>
    /// Belirtilen provider'ın verilen para birimini destekleyip desteklemediğini doğrular.
    /// Desteklemiyorsa InvalidOperationException fırlatır.
    /// </summary>
    public void ValidateProviderCurrency(string providerName, Currency currency)
    {
        var provider = GetProvider(providerName);
        if (!provider.SupportedCurrencies.Contains(currency))
            throw new InvalidOperationException(
                $"Provider '{providerName}' does not support currency '{currency}'.");
    }
}
