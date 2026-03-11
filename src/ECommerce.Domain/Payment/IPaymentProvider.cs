using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment.ValueObjects;

namespace ECommerce.Domain.Payment;

public interface IPaymentProvider
{
    /// <summary>Benzersiz provider tanımlayıcı: "Iyzico", "Stripe", "PayTR", "PayPal", "Stub"</summary>
    string ProviderName { get; }

    /// <summary>Kullanıcıya gösterilecek ad: "Kredi/Banka Kartı", "Stripe (Uluslararası Kart)" vb.</summary>
    string DisplayName { get; }

    /// <summary>Frontend logo gösterimi için path: "/images/providers/iyzico.svg"</summary>
    string LogoUrl { get; }

    /// <summary>Config'den hot-reload ile okunur. Her çağrıda güncel değeri döner.</summary>
    bool IsActive { get; }

    /// <summary>Bu provider'ın desteklediği para birimleri.</summary>
    IReadOnlySet<Currency> SupportedCurrencies { get; }

    /// <summary>3D Secure ödeme başlatma. RedirectUrl döner.</summary>
    Task<PaymentInitResult> InitializePaymentAsync(PaymentInitRequest request, CancellationToken ct = default);

    /// <summary>
    /// Webhook/callback payload'ını doğrular ve ödemeyi onaylar.
    /// Provider-specific imza doğrulaması bu metot içinde yapılır.
    /// </summary>
    Task<PaymentVerifyResult> VerifyPaymentAsync(PaymentVerifyRequest request, CancellationToken ct = default);

    /// <summary>İade işlemi. Amount verilirse kısmi iade, verilmezse tam iade.</summary>
    Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default);
}
