# Payment Integration — Multi-Provider, 3D Secure, Production-Grade

> **Strateji:** Müşteri checkout sayfasında ödeme yöntemini kendisi seçer. Provider pattern ile tüm sağlayıcılar tek interface üzerinden çalışır.
> **Aktifleştirme sırası:** Stub (dev) → Iyzico → PayTR → Stripe → PayPal
> **3D Secure:** Tüm kart ödemelerinde zorunlu — kart verisi asla backend'e ulaşmaz.
> **Mevcut altyapı:** StubPaymentService var, idempotency altyapısı hazır, PaymentRecord entity mevcut.

---

## KRİTİK MİMARİ KARARLAR

Bu bölüm, ödeme entegrasyonunun temel tasarım kararlarını tanımlar. Uygulama boyunca bu kararlardan sapma yapılmamalıdır.

### 1. Webhook vs. User Redirect Ayrımı

Bu ayrım, entegrasyonun en kritik mimari kararıdır. İki farklı mekanizma kesinlikle ayrı endpoint'lerde karşılanmalıdır:

```
POST /api/payment/webhook/{provider}   → [AllowAnonymous], server-to-server
  - Asıl ödeme onayı BURADA yapılır
  - Provider imza doğrulaması BURADA yapılır
  - Order status güncellemesi BURADA yapılır
  - Kullanıcı tarayıcıyı kapatsa bile bu çalışır

GET  /api/payment/return/{provider}    → Kullanıcı tarayıcıdan döner
  - Sadece UX yönlendirmesi yapar
  - Ödeme onayı YAPMAZ
  - PaymentRecord durumunu okur → kullanıcıyı doğru sayfaya yönlendirir
  - Eğer webhook henüz işlenmediyse → polling ile bekler (max 15sn)
```

**Neden:** Kullanıcı tarayıcıyı kapatabilir, internet kopabilir, redirect URL'i bozulabilir. Ama webhook her zaman gelir. Stripe ve PayTR kesin olarak webhook üzerinden bildirir. Ödeme onayını redirect'e bağlamak veri kaybına yol açar.

### 2. Customer-Selectable Provider

Müşteri checkout'ta aktif provider'lar arasından seçim yapar. Backend, config'den hangi provider'ların aktif olduğunu okur ve yalnızca aktif + yapılandırması geçerli olanları sunar.

```
Akıllı sıralama (frontend):
├── navigator.language.startsWith('tr') → Iyzico, PayTR, Stripe, PayPal
└── diğer                               → Stripe, PayPal, Iyzico, PayTR
```

### 3. Tek Order — Tek Aktif Ödeme

Aynı sipariş için aynı anda yalnızca bir ödeme süreci aktif olabilir. Kullanıcı Iyzico ile başlatıp yarıda bırakır, sonra Stripe ile tekrar denerse:

```
Strateji: "İptal et ve yenisini başlat"
1. Mevcut Processing durumundaki PaymentRecord → Cancelled olarak işaretle
2. Yeni PaymentRecord oluştur (yeni provider ile)
3. Yeni RedirectUrl döndür
```

Bu, iki sekmede aynı anda ödeme başlatma senaryosunu da kapsar.

### 4. Money Value Object — Merkezi Minor Unit Dönüşümü

Provider'lar farklı para birimi formatları bekler (Stripe: integer cent, Iyzico: decimal). Bu dönüşüm her provider'da ayrı ayrı yapılmamalı, merkezi `Money` value object üzerinden yapılmalıdır.

---

## ADIM 1 — Domain Katmanı Güncellemeleri

### 1.1. Currency Enum (YENİ — `ECommerce.Domain/Common/Enums/Currency.cs`)

```csharp
/// <summary>
/// ISO 4217 para birimi kodları.
/// Yeni para birimi eklendiğinde MinorUnitDigits mapping'i de güncellenmelidir.
/// </summary>
public enum Currency
{
    TRY,
    USD,
    EUR,
    GBP,
    JPY
}
```

### 1.2. Money Value Object Güncellemesi (`ECommerce.Domain/Common/ValueObjects/Money.cs`)

Mevcut `Money` record'ını güncelle — `Currency` enum'a geçir ve minor unit desteği ekle:

```csharp
public record Money
{
    public decimal Amount { get; init; }
    public Currency Currency { get; init; }

    public Money(decimal amount, Currency currency)
    {
        if (amount < 0) throw new ArgumentException("Amount cannot be negative.", nameof(amount));
        Amount = amount;
        Currency = currency;
    }

    /// <summary>
    /// Provider'lara göndermek için minor unit dönüşümü.
    /// Stripe: 10.99 USD → 1099, 500 JPY → 500
    /// </summary>
    public long ToMinorUnits() => Currency switch
    {
        Currency.JPY => (long)Amount,
        _ => (long)(Amount * 100)
    };

    /// <summary>
    /// Provider'dan gelen minor unit değerini Money'e çevirir.
    /// </summary>
    public static Money FromMinorUnits(long minorUnits, Currency currency) => currency switch
    {
        Currency.JPY => new Money(minorUnits, currency),
        _ => new Money(minorUnits / 100m, currency)
    };

    // Mevcut operatörler korunur (toplama, karşılaştırma vs.)
}
```

> **Not:** Mevcut `Money(Amount, Currency string)` kullanımını `Money(Amount, Currency enum)` olarak değiştirmek breaking change yaratır. Tüm kullanım noktalarını (OrderItem, BasketItem, Product, PaymentRecord) güncelle. EF Core configuration'larda da owned type mapping'i güncelle.

### 1.3. IPaymentProvider Interface (YENİ — `ECommerce.Domain/Payment/IPaymentProvider.cs`)

```csharp
public interface IPaymentProvider
{
    /// <summary>Benzersiz provider tanımlayıcı: "Iyzico", "Stripe", "PayTR", "PayPal", "Stub"</summary>
    string ProviderName { get; }

    /// <summary>Kullanıcıya gösterilecek ad: "Kredi/Banka Kartı", "Stripe (Uluslararası Kart)" vb.</summary>
    string DisplayName { get; }

    /// <summary>Frontend logo gösterimi için path: "/images/providers/iyzico.svg"</summary>
    string LogoUrl { get; }

    /// <summary>
    /// Config'den hot-reload ile okunur. Her çağrıda güncel değeri döner.
    /// </summary>
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
```

### 1.4. Payment Value Objects (YENİ — `ECommerce.Domain/Payment/ValueObjects/`)

```csharp
// ===== InitializePayment =====

public record PaymentInitRequest(
    string OrderId,
    string IdempotencyKey,
    Money Amount,                           // Money value object (decimal + Currency enum)
    string CustomerEmail,
    string CustomerName,
    string CustomerIp,                      // Fraud analizi için
    string UserId,                          // Fraud analizi için
    string WebhookUrl,                      // Server-to-server: /api/payment/webhook/{provider}
    string ReturnUrl,                       // User redirect: /api/payment/return/{provider}?orderId=X
    IReadOnlyList<PaymentItem> Items
);

public record PaymentItem(
    string Name,
    string Category,                        // Iyzico zorunlu tutar
    decimal Price,
    int Quantity
);

public record PaymentInitResult(
    bool IsSuccess,
    string? RedirectUrl,                    // 3D Secure sayfası URL'i
    string? ProviderReference,              // Provider tarafındaki işlem referansı
    string? ErrorCode,                      // Provider error code (loglama için)
    string? ErrorMessage                    // Provider error message
);

// ===== VerifyPayment (Webhook) =====

public record PaymentVerifyRequest(
    string OrderId,
    string ProviderReference,
    string RawPayload,                      // Ham webhook body — imza doğrulaması için
    IDictionary<string, string> Headers     // Stripe-Signature gibi header'lar
);

public record PaymentVerifyResult(
    bool IsSuccess,
    string? TransactionId,                  // Provider'ın kesin işlem ID'si
    Money? VerifiedAmount,                  // Provider'ın onayladığı tutar (doğrulama için)
    string? ErrorCode,
    string? ErrorMessage,
    PaymentStatus ResultStatus              // Completed veya Failed
);

// ===== Refund =====

public record RefundRequest(
    string OrderId,
    string TransactionId,                   // Orijinal işlem ID'si
    Money? Amount                           // null = tam iade, değer = kısmi iade
);

public record RefundResult(
    bool IsSuccess,
    string? RefundId,
    string? ErrorCode,
    string? ErrorMessage
);

// ===== Frontend DTO =====

public record PaymentProviderInfo(
    string ProviderName,
    string DisplayName,
    string LogoUrl,
    IReadOnlyList<string> SupportedCurrencies   // ["TRY", "USD", "EUR"]
);
```

### 1.5. PaymentStatus Enum Güncellemesi (`ECommerce.Domain/Payment/Enums/PaymentStatus.cs`)

```csharp
public enum PaymentStatus
{
    Pending,        // PaymentRecord oluşturuldu, henüz provider'a gönderilmedi
    Processing,     // 3D Secure başlatıldı, kullanıcı provider sayfasında
    Completed,      // Ödeme başarılı — webhook ile onaylandı
    Failed,         // Ödeme başarısız
    Expired,        // Timeout — kullanıcı 3D Secure'dan dönmedi (background job)
    Cancelled,      // Aynı order için yeni ödeme başlatıldığında eski kayıt
    Refunded        // İade edildi
}
```

### 1.6. PaymentRecord Entity Güncellemesi (`ECommerce.Domain/Payment/PaymentRecord.cs`)

Mevcut entity'ye şu alanları ekle:

```csharp
public class PaymentRecord : BaseAuditableEntity
{
    // === Mevcut alanlar korunur ===

    // === Yeni / güncellenecek alanlar ===
    public string ProviderName { get; private set; } = null!;
    public Money Amount { get; private set; } = null!;           // Ödeme tutarı + para birimi
    public string? ProviderReference { get; private set; }       // Provider tarafı referans
    public string? ProviderTransactionId { get; private set; }   // Kesinleşen transaction ID
    public string? CallbackPayload { get; private set; }         // Ham webhook payload
    public PaymentStatus Status { get; private set; }
    public string? FailureReason { get; private set; }
    public DateTime? ExpiresAt { get; private set; }             // Processing timeout süresi

    // === Domain methods ===

    public static PaymentRecord Create(
        Guid orderId,
        string idempotencyKey,
        string providerName,
        Money amount,
        TimeSpan expirationWindow)                               // Tipik: 30 dakika
    {
        return new PaymentRecord
        {
            OrderId = orderId,
            IdempotencyKey = idempotencyKey,
            ProviderName = providerName,
            Amount = amount,
            Status = PaymentStatus.Pending,
            ExpiresAt = DateTime.UtcNow.Add(expirationWindow)
        };
    }

    public void MarkProcessing(string providerReference)
    {
        if (Status != PaymentStatus.Pending)
            throw new InvalidOperationException($"Cannot mark Processing from {Status}");
        Status = PaymentStatus.Processing;
        ProviderReference = providerReference;
    }

    public void MarkCompleted(string transactionId, string callbackPayload)
    {
        if (Status is not (PaymentStatus.Processing or PaymentStatus.Pending))
            throw new InvalidOperationException($"Cannot mark Completed from {Status}");
        Status = PaymentStatus.Completed;
        ProviderTransactionId = transactionId;
        CallbackPayload = callbackPayload;
    }

    public void MarkFailed(string reason, string? callbackPayload = null)
    {
        if (Status == PaymentStatus.Completed)
            throw new InvalidOperationException("Cannot mark Failed: already Completed");
        Status = PaymentStatus.Failed;
        FailureReason = reason;
        CallbackPayload = callbackPayload;
    }

    public void MarkExpired()
    {
        if (Status != PaymentStatus.Processing)
            throw new InvalidOperationException($"Cannot expire from {Status}");
        Status = PaymentStatus.Expired;
        FailureReason = "Payment expired — 3D Secure timeout";
    }

    public void MarkCancelled(string reason)
    {
        if (Status is PaymentStatus.Completed or PaymentStatus.Refunded)
            throw new InvalidOperationException($"Cannot cancel from {Status}");
        Status = PaymentStatus.Cancelled;
        FailureReason = reason;
    }

    public void MarkRefunded(string refundId)
    {
        if (Status != PaymentStatus.Completed)
            throw new InvalidOperationException("Can only refund Completed payments");
        Status = PaymentStatus.Refunded;
    }

    public bool IsTerminal => Status is PaymentStatus.Completed
        or PaymentStatus.Failed or PaymentStatus.Expired
        or PaymentStatus.Cancelled or PaymentStatus.Refunded;
}
```

### 1.7. PaymentProviderLog Entity (YENİ — `ECommerce.Domain/Payment/PaymentProviderLog.cs`)

Audit trail için tüm provider iletişimi loglanır. PCI-DSS uyumlu: kart verisi, tam token gibi hassas alanlar asla kaydedilmez.

```csharp
public class PaymentProviderLog : BaseAuditableEntity
{
    public Guid PaymentRecordId { get; private set; }
    public string ProviderName { get; private set; } = null!;
    public string Action { get; private set; } = null!;          // "Initialize", "Verify", "Refund"
    public string? SanitizedRequest { get; private set; }        // Hassas alanlar maskelenmiş
    public string? SanitizedResponse { get; private set; }       // Hassas alanlar maskelenmiş
    public bool IsSuccess { get; private set; }
    public int? HttpStatusCode { get; private set; }
    public long DurationMs { get; private set; }                 // Performans izleme
    public string? ErrorCode { get; private set; }

    // Factory method ile oluştur — doğrudan constructor kullanılmaz
    public static PaymentProviderLog Create(...) { ... }
}
```

---

## ADIM 2 — Infrastructure Katmanı

`ECommerce.Infrastructure/Payment/` altında:

### 2.1. Provider Implementasyonları (`Providers/`)

Her provider `IPaymentProvider` interface'ini implemente eder:

#### `IyzicoPaymentProvider.cs`
- **NuGet:** `iyzipay`
- **ProviderName:** `"Iyzico"` | **DisplayName:** `"Kredi/Banka Kartı"`
- **SupportedCurrencies:** `TRY, USD, EUR, GBP`
- `InitializePaymentAsync` → Iyzico `CreateCheckoutFormInitialize` (checkout form, 3D Secure dahil)
- `VerifyPaymentAsync` → Iyzico `RetrieveCheckoutForm` ile token doğrulama
- `RefundAsync` → Iyzico `CreateRefund`
- **Webhook imza doğrulaması:** Iyzico token verification

#### `PayTRPaymentProvider.cs`
- **NuGet:** Yok — doğrudan `HttpClient` ile REST
- **ProviderName:** `"PayTR"` | **DisplayName:** `"PayTR ile Öde"`
- **SupportedCurrencies:** `TRY`
- `InitializePaymentAsync` → PayTR iFrame token oluşturma (HMAC-SHA256 hash)
- `VerifyPaymentAsync` → PayTR callback payload + HMAC-SHA256 hash doğrulama
- **Webhook imza doğrulaması:** `merchant_key + merchant_salt` ile HMAC karşılaştırması

#### `StripePaymentProvider.cs`
- **NuGet:** `Stripe.net`
- **ProviderName:** `"Stripe"` | **DisplayName:** `"Stripe (Uluslararası Kart)"`
- **SupportedCurrencies:** `USD, EUR, GBP, TRY, JPY`
- `InitializePaymentAsync` → Stripe `Checkout.Session.Create` (3D Secure otomatik)
- `VerifyPaymentAsync` → `Stripe-Signature` header ile webhook doğrulama, **ham body stream'den okunur**
- `RefundAsync` → Stripe `Refund.Create` (kısmi iade destekli)
- **Dikkat:** Stripe minor unit bekler — `Money.ToMinorUnits()` kullanılacak

#### `PayPalPaymentProvider.cs`
- **NuGet:** Yok — doğrudan `HttpClient` ile REST v2
- **ProviderName:** `"PayPal"` | **DisplayName:** `"PayPal ile Öde"`
- **SupportedCurrencies:** `USD, EUR, GBP`
- `InitializePaymentAsync` → PayPal `Orders.Create` → approve URL döndür
- `VerifyPaymentAsync` → PayPal `Orders.Capture` + access token doğrulama
- `RefundAsync` → PayPal `Captures.Refund`

#### `StubPaymentProvider.cs`
- **ProviderName:** `"Stub"` | **DisplayName:** `"Test Ödemesi"`
- **SupportedCurrencies:** Tüm Currency enum değerleri
- `InitializePaymentAsync`:
  - IdempotencyKey `"fail"` ile bitiyorsa → başarısız simülasyonu
  - Diğer → başarılı, ReturnUrl'e redirect simülasyonu
  - 300-600ms yapay gecikme
- `VerifyPaymentAsync`:
  - ProviderReference `"fail"` içeriyorsa → başarısız
  - Diğer → başarılı, VerifiedAmount = orijinal tutar (amount match testi için)
- **Development ve test ortamında kullanılır.**

### 2.2. Provider Implementasyon Kuralları

Her provider implementasyonunda şu kurallar uygulanır:

1. **Constructor injection:** `IConfiguration`, `IHttpClientFactory` (SDK olmayanlar için), `ILogger<T>`
2. **IsActive:** Her çağrıda `_config.GetValue<bool>("Payment:{ProviderName}:IsActive")` okunur (hot-reload)
3. **SupportedCurrencies:** Statik readonly set olarak tanımlanır
4. **Hata yakalama:** Provider SDK/HTTP hataları catch edilir, asla dışarıya fırlatılmaz — `IsSuccess: false` + `ErrorCode` + `ErrorMessage` ile döner
5. **Loglama:** Her provider çağrısı (init, verify, refund) `PaymentProviderLog` entity'si ile kaydedilir. Hassas alanlar (token, kart bilgisi, secret) **maskelenir**
6. **CancellationToken:** Tüm async metotlara propagate edilir
7. **Timeout:** HttpClient çağrıları için 30sn timeout

### 2.3. DI Kaydı — IEnumerable Pattern

Factory yerine DI container üzerinden `IEnumerable<IPaymentProvider>` kullanılır. Böylece yeni provider eklemek için sadece class yazmak ve DI'a kaydetmek yeterli olur.

```csharp
// ServiceCollectionExtensions.cs

// Her provider IPaymentProvider olarak kaydedilir
services.AddScoped<IPaymentProvider, StubPaymentProvider>();
services.AddScoped<IPaymentProvider, IyzicoPaymentProvider>();
services.AddScoped<IPaymentProvider, PayTRPaymentProvider>();
services.AddScoped<IPaymentProvider, StripePaymentProvider>();
services.AddScoped<IPaymentProvider, PayPalPaymentProvider>();

// Resolver: IEnumerable<IPaymentProvider> inject eder, aktif + geçerli olanları filtreler
services.AddScoped<PaymentProviderResolver>();
```

### 2.4. PaymentProviderResolver (YENİ — Factory yerine)

```csharp
public class PaymentProviderResolver
{
    private readonly IEnumerable<IPaymentProvider> _providers;

    public PaymentProviderResolver(IEnumerable<IPaymentProvider> providers)
    {
        _providers = providers;
    }

    /// <summary>Aktif ve yapılandırması geçerli tüm provider'ları döndür.</summary>
    public IReadOnlyList<IPaymentProvider> GetActiveProviders()
        => _providers.Where(p => p.IsActive).ToList();

    /// <summary>
    /// Belirtilen provider'ı döndür.
    /// Bulunamazsa veya aktif değilse DomainException fırlatır.
    /// </summary>
    public IPaymentProvider GetProvider(string providerName)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            throw new DomainException($"Payment provider '{providerName}' not found.");
        if (!provider.IsActive)
            throw new DomainException($"Payment provider '{providerName}' is currently disabled.");

        return provider;
    }

    /// <summary>
    /// Belirtilen provider'ın verilen para birimini destekleyip desteklemediğini kontrol eder.
    /// </summary>
    public void ValidateProviderCurrency(string providerName, Currency currency)
    {
        var provider = GetProvider(providerName);
        if (!provider.SupportedCurrencies.Contains(currency))
            throw new DomainException(
                $"Provider '{providerName}' does not support currency '{currency}'.");
    }
}
```

### 2.5. PaymentSanitizer (YENİ — `Payment/PaymentSanitizer.cs`)

Provider request/response loglarından hassas alanları maskeler:

```csharp
public static class PaymentSanitizer
{
    // Maskelenmesi gereken alan adları (büyük-küçük harf duyarsız):
    // cardNumber, cvv, cvc, pan, cardHolderName, token, secretKey, apiKey,
    // signature, password, merchantKey, merchantSalt, Stripe-Signature

    public static string Sanitize(string payload) { ... }
    // "cardNumber": "5400000000000001" → "cardNumber": "****0001"
    // "token": "abc123xyz" → "token": "***MASKED***"
}
```

### 2.6. Startup Config Validation (YENİ)

Uygulama başlarken aktif provider'ların yapılandırmasını doğrula. Runtime'da ilk ödeme denemesinde patlamak yerine startup'ta net hata ver.

```csharp
// Program.cs veya IHostedService olarak

// Startup'ta çalışır:
// 1. Her IsActive=true provider için gerekli config key'lerini kontrol et
//    - Iyzico: ApiKey, SecretKey, BaseUrl boş olmamalı
//    - Stripe: SecretKey, WebhookSecret boş olmamalı
//    - PayTR: MerchantId, MerchantKey, MerchantSalt boş olmamalı
//    - PayPal: ClientId, ClientSecret, BaseUrl boş olmamalı
// 2. Eksik varsa → ILogger.LogWarning ile uyar + provider'ı devre dışı bırak
// 3. Hiçbir provider aktif değilse → ILogger.LogError
```

### 2.7. Payment Expiration Background Job (YENİ)

`Processing` durumunda kalan ödemeleri belirli süre sonra `Expired` olarak işaretler.

```csharp
// IHostedService veya BackgroundService olarak

// Her 5 dakikada bir çalışır:
// 1. PaymentRecord tablosunda Status == Processing && ExpiresAt < DateTime.UtcNow olanları bul
// 2. Her birini MarkExpired() ile güncelle
// 3. İlgili Order'ın status'unu da uygun şekilde güncelle (Pending'e geri al)
// 4. Structured log at: "Payment expired. OrderId={OrderId}, Provider={Provider}"

// ExpiresAt süresi: PaymentRecord.Create() içinde 30 dakika olarak set edilir
// Bu süre appsettings'den okunabilir: "Payment:ExpirationMinutes": 30
```

---

## ADIM 3 — Application Katmanı

### 3.1. GetActivePaymentProvidersQuery (YENİ)

```csharp
public record GetActivePaymentProvidersQuery : IRequest<List<PaymentProviderInfo>>;

// Handler:
// 1. resolver.GetActiveProviders()
// 2. Her provider → PaymentProviderInfo map et
// 3. ICacheableQuery olarak 5dk cache (provider listesi nadiren değişir)
```

### 3.2. InitializePaymentCommand (YENİ)

```csharp
public record InitializePaymentCommand(
    string OrderId,
    string ProviderName,
    string IdempotencyKey,
    string ReturnUrl           // Frontend callback sayfası URL'i
) : IRequest<InitializePaymentResponse>;

public record InitializePaymentResponse(
    bool IsSuccess,
    string? RedirectUrl,
    string? ErrorMessage
);
```

**Handler sırası (önemli — bu sıra değiştirilmemelidir):**

```
1.  Order'ı bul → bulunamazsa NotFoundException
2.  Ownership kontrolü: Order.UserId == CurrentUser.Id → değilse ForbiddenException
3.  Order durumu kontrolü: sadece Pending durumundaki order'a ödeme başlatılabilir
4.  Currency-Provider uyumluluk kontrolü:
    resolver.ValidateProviderCurrency(providerName, order.Currency)
5.  Aynı order için aktif ödeme kontrolü:
    - Processing durumunda PaymentRecord varsa → onu Cancelled olarak işaretle
    - Completed durumunda PaymentRecord varsa → zaten ödendi, hata dön
6.  Idempotency kontrolü: Aynı IdempotencyKey ile başarılı kayıt varsa → mevcut sonucu dön
7.  PaymentRecord.Create(orderId, idempotencyKey, providerName, order.TotalAmount, 30dk)
8.  provider.InitializePaymentAsync() çağır:
    - WebhookUrl = "{baseUrl}/api/payment/webhook/{providerName}"
    - ReturnUrl = "{baseUrl}/api/payment/return/{providerName}?orderId={orderId}"
    - CustomerIp = HttpContext'ten al (X-Forwarded-For aware)
9.  Başarılı: PaymentRecord.MarkProcessing(providerReference), save, RedirectUrl dön
10. Başarısız: PaymentRecord.MarkFailed(errorMessage), save, hata dön
```

**Validator (FluentValidation — boş validator YASAK):**
- `OrderId`: NotEmpty, geçerli GUID formatı
- `ProviderName`: NotEmpty
- `IdempotencyKey`: NotEmpty, geçerli UUID formatı
- `ReturnUrl`: NotEmpty, geçerli URL formatı (Uri.TryCreate ile)

### 3.3. VerifyPaymentWebhookCommand (YENİ)

```csharp
public record VerifyPaymentWebhookCommand(
    string ProviderName,
    string RawBody,
    IDictionary<string, string> Headers
) : IRequest<VerifyPaymentWebhookResponse>;

public record VerifyPaymentWebhookResponse(
    bool IsSuccess,
    string? OrderId,
    string? ErrorMessage
);
```

**Handler sırası (kritik — güvenlik kontrolleri bu sırayla):**

```
1.  Provider'ı al: resolver.GetProvider(providerName)
2.  provider.VerifyPaymentAsync() çağır (imza doğrulaması provider içinde yapılır)
3.  İmza geçersizse → 400 dön, log at (olası saldırı)
4.  PaymentRecord bul (ProviderReference ile)
5.  Idempotency: Zaten Completed ise → idempotent başarı dön (webhook retry)
    - ProviderTransactionId eşleşiyor mu kontrol et (farklıysa log at, uyarı)
6.  ÇOK KRİTİK — Tutar doğrulaması:
    verifyResult.VerifiedAmount.Amount == paymentRecord.Amount.Amount
    verifyResult.VerifiedAmount.Currency == paymentRecord.Amount.Currency
    Eşleşmezse → PaymentRecord.MarkFailed("Amount mismatch"), log at (olası fraud)
7.  Başarılı: PaymentRecord.MarkCompleted(transactionId, rawBody)
    Order.Status → Paid (veya Confirmed — mevcut OrderStatus enum'a göre)
8.  Başarısız: PaymentRecord.MarkFailed(errorMessage, rawBody)
```

**Validator:** ProviderName NotEmpty, RawBody NotEmpty

### 3.4. GetPaymentReturnStatusQuery (YENİ)

Kullanıcı tarayıcıdan döndüğünde ödeme durumunu sorgulamak için:

```csharp
public record GetPaymentReturnStatusQuery(
    string OrderId,
    string ProviderName
) : IRequest<PaymentReturnStatusResponse>;

public record PaymentReturnStatusResponse(
    string OrderId,
    PaymentStatus Status,
    bool IsTerminal               // Polling'i durdurması için
);
```

Handler: PaymentRecord'u bul, Status ve IsTerminal dön. Ownership kontrolü yap.

### 3.5. RefundPaymentCommand (YENİ)

```csharp
public record RefundPaymentCommand(
    string OrderId,
    decimal? Amount               // null = tam iade, değer = kısmi iade
) : IRequest<RefundPaymentResponse>;
```

Handler: Admin yetkisi kontrolü, Completed durumundaki PaymentRecord'u bul, provider.RefundAsync() çağır.

### 3.6. Mevcut ProcessPaymentCommand Kaldırılması

Mevcut `ProcessPaymentCommand` ve handler'ı kaldırılır, yerini `InitializePaymentCommand` + `VerifyPaymentWebhookCommand` alır.

---

## ADIM 4 — Persistence Katmanı

### 4.1. PaymentRecord EF Configuration Güncellemesi

```csharp
// PaymentRecordConfiguration.cs

// Yeni/değişen alanlar:
builder.OwnsOne(p => p.Amount);            // Money owned type (Amount + Currency)
builder.Property(p => p.ProviderName).HasMaxLength(50).IsRequired();
builder.Property(p => p.ProviderReference).HasMaxLength(500);
builder.Property(p => p.ProviderTransactionId).HasMaxLength(500);
builder.Property(p => p.CallbackPayload).HasColumnType("text");
builder.Property(p => p.FailureReason).HasMaxLength(1000);
builder.Property(p => p.ExpiresAt);
builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(20);

// Index: Processing + ExpiresAt (background job performansı için)
builder.HasIndex(p => new { p.Status, p.ExpiresAt })
    .HasFilter("\"Status\" = 'Processing'")
    .HasDatabaseName("IX_PaymentRecords_Processing_ExpiresAt");

// Mevcut unique index korunur: (OrderId, IdempotencyKey)
```

### 4.2. PaymentProviderLog EF Configuration (YENİ)

```csharp
// DbSet<PaymentProviderLog> eklenir
// SanitizedRequest ve SanitizedResponse: text
// Index: PaymentRecordId, CreatedAt
```

### 4.3. Migration

```bash
dotnet ef migrations add Payment_MultiProvider_3DSecure \
  --project src/ECommerce.Persistence \
  --startup-project src/ECommerce.API
```

**Bu migration'ın kapsamı:**
- PaymentRecord: ProviderName, ProviderReference, ProviderTransactionId, CallbackPayload, FailureReason, ExpiresAt, Amount (owned type), Currency (owned type), Status string conversion
- PaymentProviderLog: Yeni tablo
- PaymentStatus enum değişikliği (Processing, Expired, Cancelled eklendi)

---

## ADIM 5 — API Katmanı

### 5.1. PaymentController Güncellemesi

```csharp
[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    // === Aktif provider listesi ===
    [HttpGet("providers")]
    [Authorize]
    public async Task<IActionResult> GetProviders()
    // → GetActivePaymentProvidersQuery
    // Response: [{ providerName, displayName, logoUrl, supportedCurrencies }]

    // === Ödeme başlatma ===
    [HttpPost("initialize")]
    [Authorize]
    public async Task<IActionResult> InitializePayment(InitializePaymentRequest request)
    // → InitializePaymentCommand
    // Response: { isSuccess, redirectUrl, errorMessage }

    // === Webhook — provider server-to-server bildirimi ===
    [HttpPost("webhook/{provider}")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook(string provider)
    {
        // HAM BODY OKUNUR — Stripe imza doğrulaması için bu şart
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync();

        // Header'lar toplanır
        var headers = Request.Headers.ToDictionary(
            h => h.Key,
            h => h.Value.ToString());

        var command = new VerifyPaymentWebhookCommand(provider, rawBody, headers);
        var result = await _mediator.Send(command);

        // Provider'a 200 dönülür (yoksa retry yapar)
        return result.IsSuccess ? Ok() : BadRequest();
    }

    // === User return — tarayıcıdan dönüş ===
    [HttpGet("return/{provider}")]
    [AllowAnonymous]
    public async Task<IActionResult> Return(
        string provider,
        [FromQuery] string orderId)
    {
        // Ödeme durumunu sorgula
        var status = await _mediator.Send(
            new GetPaymentReturnStatusQuery(orderId, provider));

        // Frontend'e redirect:
        // Completed → /orders/{orderId}/confirmation
        // Failed/Expired → /checkout?error=payment_failed&orderId={orderId}
        // Processing → /payment/waiting?orderId={orderId} (webhook henüz gelmedi)
        var frontendBaseUrl = _config["Frontend:BaseUrl"];
        var redirectUrl = status.Status switch
        {
            PaymentStatus.Completed => $"{frontendBaseUrl}/orders/{orderId}/confirmation",
            PaymentStatus.Processing => $"{frontendBaseUrl}/payment/waiting?orderId={orderId}",
            _ => $"{frontendBaseUrl}/checkout?error=payment_failed&orderId={orderId}"
        };

        return Redirect(redirectUrl);
    }

    // === İade — sadece admin ===
    [HttpPost("{orderId}/refund")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Refund(string orderId, [FromBody] RefundRequest? request)
    // → RefundPaymentCommand(orderId, request?.Amount)
}
```

### 5.2. Rate Limiting

`/api/payment/initialize` endpoint'ine ek rate limiting:

```csharp
// Mevcut 100 req/min genel limitin yanında, initialize için daha sıkı:
// Aynı kullanıcı: 5 istek / 10 dakika
// Aynı IP: 10 istek / 10 dakika

options.AddPolicy("PaymentInitialize", context =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? context.Connection.RemoteIpAddress?.ToString(),
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 5,
            Window = TimeSpan.FromMinutes(10)
        }));

// Controller'da:
[HttpPost("initialize")]
[Authorize]
[EnableRateLimiting("PaymentInitialize")]
```

---

## ADIM 6 — Frontend Güncellemesi

### 6.1. Yeni Tipler (`src/features/ordering/types/payment.ts`)

```ts
export interface PaymentProviderInfo {
  providerName: string;
  displayName: string;
  logoUrl: string;
  supportedCurrencies: string[];
}

export interface InitializePaymentRequest {
  orderId: string;
  providerName: string;
  idempotencyKey: string;
  returnUrl: string;
}

export interface InitializePaymentResponse {
  isSuccess: boolean;
  redirectUrl?: string;
  errorMessage?: string;
}

export interface PaymentReturnStatus {
  orderId: string;
  status: string;
  isTerminal: boolean;
}
```

### 6.2. API Layer (`src/features/ordering/api/paymentApi.ts`)

```ts
// Mock/Real toggle VITE_USE_MOCK_API ile — mevcut patern korunur

export const paymentApi = {
  getProviders: () => client.get<ApiResponse<PaymentProviderInfo[]>>('/payment/providers'),
  initialize: (data: InitializePaymentRequest) =>
    client.post<ApiResponse<InitializePaymentResponse>>('/payment/initialize', data),
  getReturnStatus: (orderId: string) =>
    client.get<ApiResponse<PaymentReturnStatus>>(`/payment/return-status?orderId=${orderId}`),
};
```

### 6.3. Hooks

#### `usePaymentProviders.ts` (YENİ)
```ts
// GET /api/payment/providers
// staleTime: 5 dakika
// select: akıllı sıralama uygula (navigator.language)
```

#### `useInitializePayment.ts` (YENİ)
```ts
// POST /api/payment/initialize
// onSuccess: window.location.href = redirectUrl (provider 3D Secure sayfasına git)
// onError: toast ile hata göster
// Idempotency key: generateIdempotencyKey() — mevcut utils/idempotency.ts kullanılır
```

### 6.4. PaymentMethodSelector Component (YENİ — `src/features/ordering/components/PaymentMethodSelector.tsx`)

```tsx
interface Props {
  selectedProvider: string | null;
  onSelect: (providerName: string) => void;
}

// Akıllı sıralama:
const isTurkish = navigator.language.startsWith('tr');
const preferredOrder = isTurkish
  ? ['Iyzico', 'PayTR', 'Stripe', 'PayPal']
  : ['Stripe', 'PayPal', 'Iyzico', 'PayTR'];

// Her provider kart olarak gösterilir:
// [Logo] [DisplayName] ← radio button ile seçim
// Seçili kart: border-primary + bg-primary/5 ile highlight
// Loading state: skeleton kartlar
// Error state: "Ödeme yöntemleri yüklenemedi" mesajı
// Empty state: "Şu anda aktif ödeme yöntemi bulunmuyor" mesajı
```

### 6.5. CheckoutPage Güncellemesi

```
Mevcut akış:
[Sepet Özeti] → [Teslimat Adresi] → [PaymentForm (kart bilgisi)] → [Ödeme Yap]

Yeni akış:
[Sepet Özeti] → [Teslimat Adresi] → [PaymentMethodSelector] → [Ödemeye Geç]
                                      ↑ YENİ                    ↑ GÜNCELLEME

Değişiklikler:
1. PaymentForm (kart formu) KALDIRILIR — 3D Secure'da kart bilgisi provider sayfasında girilir
2. PaymentMethodSelector eklenir — provider seçimi
3. "Ödemeye Geç" butonu:
   - Provider seçilmeden → disabled
   - Seçildikten sonra → initializePayment çağrısı → redirectUrl'e yönlendir
4. clearTrigger prop'u ve ilgili logic kaldırılır
```

### 6.6. useCheckout Hook Güncellemesi

```ts
// Yeni akış:
// Adım 1: createOrder (mevcut — değişmez)
// Adım 2: initializePayment({
//            orderId,
//            providerName: selectedProvider,
//            idempotencyKey: generateIdempotencyKey(),
//            returnUrl: `${window.location.origin}/payment/waiting`
//          })
// Adım 3: window.location.href = response.redirectUrl
//          (kullanıcı provider 3D Secure sayfasına gider)
// Adım 4: Provider → backend webhook + kullanıcı return URL'e döner
```

### 6.7. PaymentWaitingPage (YENİ — `src/features/ordering/pages/PaymentWaitingPage.tsx`)

```
Route: /payment/waiting?orderId=X

Bu sayfa, kullanıcı provider'dan döndüğünde ama webhook henüz işlenmediğinde gösterilir.
(Backend return endpoint'i buraya redirect eder)

Davranış:
1. orderId'yi URL'den al
2. 3sn aralıklarla GET /api/payment/return-status?orderId=X polling yap
3. Max 15sn (5 deneme) bekle
4. Status Completed → /orders/{orderId}/confirmation'a redirect
5. Status Failed/Expired → /checkout?error=payment_failed&orderId={orderId}
6. Timeout (15sn sonra hâlâ Processing) → "Ödemeniz işleniyor, siparişlerinizden takip edebilirsiniz" mesajı + /orders linkle

UI:
- Ortada spinner
- "Ödemeniz doğrulanıyor..." yazısı
- Alt kısımda: "Bu işlem birkaç saniye sürebilir"
```

### 6.8. Hata Mesajı Mapping (YENİ — `src/features/ordering/utils/paymentErrors.ts`)

Provider hata kodlarını kullanıcı dostu mesajlara çeviren mapping:

```ts
const errorMessages: Record<string, { tr: string; en: string }> = {
  'insufficient_funds':    { tr: 'Kartınızda yeterli bakiye bulunmuyor.', en: 'Insufficient funds.' },
  'card_declined':         { tr: 'Kartınız reddedildi.', en: 'Card declined.' },
  '3ds_failed':            { tr: '3D Secure doğrulaması başarısız.', en: '3D Secure verification failed.' },
  'expired_card':          { tr: 'Kartınızın süresi dolmuş.', en: 'Card has expired.' },
  'amount_mismatch':       { tr: 'Ödeme tutarında uyuşmazlık.', en: 'Payment amount mismatch.' },
  'provider_unavailable':  { tr: 'Ödeme sağlayıcısına ulaşılamıyor.', en: 'Payment provider unavailable.' },
  'payment_expired':       { tr: 'Ödeme süresi doldu, lütfen tekrar deneyin.', en: 'Payment expired.' },
  'default':               { tr: 'Bir hata oluştu, lütfen tekrar deneyin.', en: 'An error occurred.' },
};

export function getPaymentErrorMessage(errorCode?: string): string {
  const lang = navigator.language.startsWith('tr') ? 'tr' : 'en';
  return errorMessages[errorCode ?? 'default']?.[lang]
      ?? errorMessages['default'][lang];
}
```

### 6.9. Router Güncellemesi

```ts
// Yeni route'lar:
{ path: '/payment/waiting', element: <PaymentWaitingPage /> }    // public, lazy

// Kaldırılan / güncellenen:
// PaymentCallbackPage → PaymentWaitingPage (isim ve mantık değişikliği)
```

---

## ADIM 7 — appsettings Yapılandırması

### `appsettings.Development.json`

```json
{
  "Payment": {
    "ExpirationMinutes": 30,
    "Stub":   { "IsActive": true },
    "Iyzico": { "IsActive": false, "ApiKey": "", "SecretKey": "", "BaseUrl": "https://sandbox-api.iyzipay.com" },
    "PayTR":  { "IsActive": false, "MerchantId": "", "MerchantKey": "", "MerchantSalt": "" },
    "Stripe": { "IsActive": false, "SecretKey": "", "PublishableKey": "", "WebhookSecret": "" },
    "PayPal": { "IsActive": false, "ClientId": "", "ClientSecret": "", "BaseUrl": "https://api-m.sandbox.paypal.com" }
  },
  "Frontend": {
    "BaseUrl": "http://localhost:5173"
  }
}
```

### `appsettings.json` (production template)

```json
{
  "Payment": {
    "ExpirationMinutes": 30,
    "Stub":   { "IsActive": false },
    "Iyzico": { "IsActive": true, "ApiKey": "", "SecretKey": "", "BaseUrl": "https://api.iyzipay.com" },
    "PayTR":  { "IsActive": true, "MerchantId": "", "MerchantKey": "", "MerchantSalt": "" },
    "Stripe": { "IsActive": true, "SecretKey": "", "PublishableKey": "", "WebhookSecret": "" },
    "PayPal": { "IsActive": true, "ClientId": "", "ClientSecret": "", "BaseUrl": "https://api-m.paypal.com" }
  }
}
```

> **Not:** Production değerleri Azure Key Vault'tan gelecek. appsettings.json'a secret yazılmaz.

---

## ADIM 8 — Migration

```bash
dotnet ef migrations add Payment_MultiProvider_3DSecure \
  --project src/ECommerce.Persistence \
  --startup-project src/ECommerce.API
```

---

## ADIM 9 — Unit Testler

### Yeni test sınıfları:

1. **`MoneyMinorUnitTests`** — `ToMinorUnits()` ve `FromMinorUnits()` TRY, USD, EUR, JPY için
2. **`PaymentRecordTests`** — State machine: tüm geçerli/geçersiz durum geçişleri
3. **`InitializePaymentHandlerTests`** — Ownership, concurrent payment, idempotency, currency uyumluluk
4. **`VerifyPaymentWebhookHandlerTests`** — Amount doğrulaması, idempotent retry, imza hatası senaryoları
5. **`PaymentProviderResolverTests`** — Aktif/pasif provider, bilinmeyen provider, currency doğrulama
6. **`StubPaymentProviderTests`** — Başarılı/başarısız simülasyon senaryoları

### Mevcut test güncellemeleri:

- `ProcessPaymentHandlerTests` → kaldırılır veya `InitializePaymentHandlerTests` ile değiştirilir
- `PaymentRecordTests` → yeni state machine metotlarını kapsar

---

## GÜVENLİK KURALLARI (Değişmez — İhlal Edilemez)

1. **Kart verisi backend'de saklanmaz, transit geçmez, loglanmaz.** Tüm kart bilgisi provider'ın 3D Secure sayfasında girilir.
2. **Webhook imza doğrulaması zorunlu.** Her provider kendi imza mekanizmasını handler içinde doğrular. Geçersiz imza → 400 + loglama.
3. **Tutar doğrulaması zorunlu.** Webhook'ta provider'dan gelen tutar, PaymentRecord'daki tutarla karşılaştırılır. Eşleşmezse → Failed + loglama (olası fraud).
4. **CallbackPayload ham saklanır ama loglanmaz.** PaymentProviderLog'da sanitize edilmiş versiyonu tutulur.
5. **`[AllowAnonymous]` sadece webhook ve return endpoint'lerinde.** Diğer tüm ödeme endpoint'leri `[Authorize]` gerektirir.
6. **Provider config secret'ları appsettings'e yazılmaz.** Development'ta user-secrets, production'da Azure Key Vault kullanılır.
7. **Rate limiting:** `/initialize` endpoint'inde kullanıcı başına 5 istek/10dk limiti.
8. **IP çözümleme:** `X-Forwarded-For` header'ından güvenilir IP — reverse proxy yapılandırmasına dikkat.

---

## LOGLAMA STRATEJİSİ

Her ödeme adımı için Serilog ile structured log atılır. `CorrelationId` olarak `PaymentRecord.Id` veya `OrderId` kullanılır.

```
Loglanacak olaylar:
├── Payment.Initialize.Started   → OrderId, Provider, Amount, Currency, UserId, CustomerIp
├── Payment.Initialize.Success   → OrderId, Provider, ProviderReference, RedirectUrl
├── Payment.Initialize.Failed    → OrderId, Provider, ErrorCode, ErrorMessage
├── Payment.Webhook.Received     → Provider, ContentLength (payload loglanmaz!)
├── Payment.Webhook.Verified     → OrderId, Provider, TransactionId, VerifiedAmount
├── Payment.Webhook.Failed       → OrderId, Provider, ErrorCode, ErrorMessage
├── Payment.Webhook.AmountMismatch → OrderId, Expected, Actual (KRİTİK ALERT)
├── Payment.Webhook.InvalidSignature → Provider, IP (GÜVENLİK ALERT)
├── Payment.Webhook.Idempotent   → OrderId, Provider (zaten Completed, tekrar geldi)
├── Payment.Expired              → OrderId, Provider, CreatedAt, ExpiresAt
├── Payment.Cancelled            → OrderId, Provider, Reason
├── Payment.Refund.Started       → OrderId, Provider, Amount
├── Payment.Refund.Success       → OrderId, Provider, RefundId
└── Payment.Refund.Failed        → OrderId, Provider, ErrorCode
```

**Asla loglanmayacak:** CardNumber, CVV, Token, ApiKey, SecretKey, MerchantKey, ham CallbackPayload

---

## İDEMPOTENCY STRATEJİSİ

1. **Frontend tarafı:** `generateIdempotencyKey()` fonksiyonu `crypto.randomUUID()` kullanır (mevcut `utils/idempotency.ts`).
2. **Key formatı:** UUID v4 (32 karakter hex + tire)
3. **Unique constraint:** `(OrderId, IdempotencyKey)` — DB seviyesinde
4. **Aynı key + aynı provider = idempotent:** Mevcut sonuç döner
5. **Aynı key + farklı provider:** Yeni key üretilmeli — bu kuralı frontend'de enforce et (provider değiştiğinde key yenile)
6. **Webhook retry:** `ProviderTransactionId` kontrolü ile — aynı transaction birden fazla webhook'ta gelirse idempotent başarı dön

---

## BAŞLAMADAN ÖNCE — ZORUNLU ADIMLAR

Bu prompt'u uygulamaya başlamadan önce şu sırayı takip et:

### Adım A: Mevcut kodu oku ve anla
1. `ECommerce.Domain/Payment/PaymentRecord.cs` — mevcut entity yapısı
2. `ECommerce.Domain/Payment/Enums/PaymentStatus.cs` — mevcut enum
3. `ECommerce.Domain/Common/ValueObjects/Money.cs` — mevcut Money record
4. `ECommerce.Infrastructure/Payment/StubPaymentService.cs` — mevcut stub
5. `ECommerce.Application/Features/Payment/Commands/ProcessPayment/` — mevcut handler
6. `ECommerce.API/Controllers/PaymentController.cs` — mevcut controller
7. `ECommerce.Persistence/Configurations/PaymentRecordConfiguration.cs` — mevcut EF config
8. `src/ECommerce.Web/src/features/ordering/` — mevcut frontend checkout akışı
9. `ECommerce.UnitTests/Application/ProcessPaymentHandlerTests.cs` — mevcut testler

### Adım B: Değişecek ve oluşturulacak dosyaların tam listesini çıkar
Listeyi şu formatta sun:

```
GÜNCELLENECEK:
- [dosya yolu] — [ne değişecek, kısa açıklama]

OLUŞTURULACAK:
- [dosya yolu] — [ne yapacak, kısa açıklama]

KALDIRILACAK:
- [dosya yolu] — [neden kaldırılıyor]
```

### Adım C: Onayımı bekle
Dosya listesini sunduktan sonra **onayımı bekle — sonra uygula.** Onay almadan kod yazma.

---

## DEFINITION OF DONE

### Build & Test
- [ ] `dotnet build ECommerce.sln` → 0 hata
- [ ] `dotnet test ECommerce.sln` → tüm testler geçiyor (mevcut + yeni)
- [ ] `npx tsc --noEmit` → 0 hata
- [ ] Architecture testleri hâlâ geçiyor (katman bağımlılık kuralları bozulmamış)

### Backend İşlevsellik
- [ ] Migration temiz uygulandı — mevcut veri bozulmadı
- [ ] Stub aktifken checkout akışı çalışıyor (tam döngü: init → redirect → webhook → complete)
- [ ] `IsActive: true` yapılınca ilgili provider devreye giriyor
- [ ] Startup'ta aktif provider config doğrulaması çalışıyor
- [ ] Aynı order için ikinci ödeme → mevcut Processing kaydı Cancelled olarak işaretleniyor
- [ ] Webhook idempotency: aynı webhook iki kez gelirse hata vermiyor
- [ ] Webhook'ta tutar doğrulaması çalışıyor — mismatch'te Failed + log
- [ ] Webhook'ta imza doğrulaması çalışıyor — geçersiz imzada 400 + log
- [ ] Payment expiration background job çalışıyor (30dk sonra Processing → Expired)
- [ ] Rate limiting: 5 istek/10dk aşıldığında 429 dönüyor
- [ ] Kart verisi hiçbir log satırında görünmüyor
- [ ] PaymentProviderLog tablosuna sanitize edilmiş kayıtlar yazılıyor

### Frontend İşlevsellik
- [ ] Checkout sayfasında provider seçim kartları görünüyor
- [ ] Tarayıcı dili TR → Iyzico/PayTR önce sıralı
- [ ] Provider seçilmeden "Ödemeye Geç" butonu disabled
- [ ] Seçili provider ile ödeme başlatılıyor → RedirectUrl alınıyor
- [ ] PaymentWaitingPage: loading/polling/success/error/timeout durumları çalışıyor
- [ ] Hata mesajları kullanıcı dostu ve dil bazlı gösteriliyor
- [ ] PaymentForm (eski kart formu) kaldırılmış, referansları temizlenmiş
- [ ] Loading, error, empty state'ler tüm yeni componentlarda mevcut
- [ ] Mock API toggle çalışıyor (VITE_USE_MOCK_API)

---

## GELECEKTE EKLENEBİLECEK (MVP KAPSAM DIŞI — Şimdi uygulanmayacak)

Bu maddeler prompt'ta referans olarak tutulur ama bu aşamada uygulanmaz:

1. **Provider Health Check / Circuit Breaker** — Provider down ise otomatik gizleme
2. **Provider Capabilities** (taksit, cüzdan, vb.) — `IProviderCapabilities` interface
3. **Webhook IP whitelist** — Provider IP aralıklarını doğrulama
4. **Ödeme bildirimi** (e-posta/SMS) — ödeme sonrası bilgilendirme
5. **Detaylı iade yönetim paneli** — admin'de iade geçmişi, kısmi iade UI
6. **Multi-currency checkout** — Kullanıcının para birimi seçmesi
7. **Saved payment methods** — Tokenized kart saklama (provider tarafında)
