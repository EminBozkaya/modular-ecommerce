namespace ECommerce.Domain.Identity;

/// <summary>
/// Sosyal platform kimlik doğrulama sağlayıcısı.
/// IPaymentProvider desenine paralel — her sosyal platform bunu implement eder.
/// </summary>
public interface ISocialAuthProvider
{
    /// <summary>Benzersiz provider tanımlayıcı: "Google", "Facebook", "Apple", "Instagram", "X"</summary>
    string ProviderName { get; }

    /// <summary>Kullanıcıya gösterilecek ad: "Google ile Giriş Yap" vb.</summary>
    string DisplayName { get; }

    /// <summary>Config'den hot-reload ile okunur. Her çağrıda güncel değeri döner.</summary>
    bool IsActive { get; }

    /// <summary>OAuth Authorization URL oluşturur.</summary>
    Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default);

    /// <summary>Authorization code → user bilgisine dönüştürür (token exchange + user info fetch).</summary>
    Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default);
}
