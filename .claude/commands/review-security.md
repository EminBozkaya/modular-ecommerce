# /review-security
# Projenin uçtan uca güvenlik durumunu inceler: auth, token, ödeme, CORS, rate limiting.
# Kullanım: Claude Code'da `/review-security` yazın.

## Görev
Hem backend hem frontend güvenlik kontrollerini aşağıdaki adımlarla uygula.
Format: "✅ Temiz" veya "⚠️ [dosya:satır] — açıklama"

---

## Adım 1 — JWT & Cookie Güvenliği (Backend)

`ECommerce.Infrastructure/Identity/JwtService.cs` ve ilgili auth konfigürasyonunu incele:

- Access token süresi 15 dakika veya daha kısa mı?
- Cookie `HttpOnly: true` ayarlı mı?
- Cookie `Secure: true` ayarlı mı? (HTTPS zorunlu)
- Cookie `SameSite` politikası tanımlı mı?
- Refresh token rotation her kullanımda gerçekleşiyor mu?
- Eski refresh token kullanım sonrası geçersiz kılınıyor mu?

---

## Adım 2 — Token Depolama Kontrolü (Frontend)

`src/ECommerce.Web/src/` altındaki tüm dosyaları tara:

- `localStorage.setItem` içeren satırlar → token/auth verisi mi? YASAK
- `sessionStorage.setItem` → token/auth verisi mi? YASAK
- `document.cookie` ile manuel cookie yazımı → YASAK
- `authStore`'da token alanı var mı? → YASAK (sadece user bilgisi olmalı)

---

## Adım 3 — Ödeme Güvenliği Kontrolü

**Backend:**
- `PaymentRecord` entity'sinde kart numarası, CVV, expiry alanı var mı? → YASAK
- Kart verisi herhangi bir log satırında geçiyor mu? → YASAK
- `(OrderId, IdempotencyKey)` unique index tanımlı mı? → OLMASI GEREKEN

**Frontend:**
- `PaymentForm` submit sonrası `clearTrigger` ile temizleniyor mu?
- Kart verisi Zustand store'a yazılıyor mu? → YASAK
- Kart verisi React Query cache'ine giriyor mu? → YASAK
- Her retry'da yeni `idempotencyKey` üretiliyor mu?

---

## Adım 4 — Authorization Kontrolü (Backend)

`ECommerce.API/Controllers/` altındaki tüm controller'ları tara:

- Admin controller'ları `[Authorize(Roles = "Admin")]` attribute'una sahip mi?
- `[AllowAnonymous]` kullanımı gerekliyken mi uygulanmış?
- Müşteri endpoint'lerinde `[Authorize]` attribute'u var mı? (gerekenler için)
- Admin endpoint'leri gerçekten admin yetkisi kontrol ediyor mu, sadece attribute yetmez — handler'da da kontrol var mı?

---

## Adım 5 — Rate Limiting & CORS Kontrolü (Backend)

`ECommerce.API/` Program.cs veya extension dosyalarını incele:

- Rate limiting middleware kayıtlı mı?
- Rate limiting politikası tanımlı mı? (istek/dakika limiti)
- CORS politikası `AllowAnyOrigin()` mu? → YASAK (whitelist olmalı)
- CORS izin verilen origin'ler hardcode mu yoksa config'den mi okunuyor?

---

## Adım 6 — Hassas Veri Loglama Kontrolü

Tüm backend `.cs` dosyalarını tara, şu pattern'leri ara:

- `"password"`, `"Password"` içeren log satırı → YASAK
- `"token"`, `"Token"`, `"refreshToken"` içeren log satırı → YASAK
- `"cardNumber"`, `"cvv"`, `"Cvv"` içeren log satırı → YASAK
- Request/response body'yi tamamen loglayan middleware → UYARI (hassas veri sızabilir)

---

## Adım 7 — Hardcode Secret Kontrolü

Tüm proje dosyalarını tara:

- `appsettings.json` veya `appsettings.Development.json` içinde gerçek secret/key değeri → UYARI
- Kaynak kodda hardcode connection string → YASAK
- Kaynak kodda hardcode JWT secret → YASAK
- `.env` veya `.env.local` dosyası `.gitignore`'da mı?

---

## Özet Rapor

| Adım | Durum | Bulgu Sayısı |
|------|-------|--------------|
| JWT & Cookie güvenliği | ✅/⚠️ | N |
| Token depolama | ✅/⚠️ | N |
| Ödeme güvenliği | ✅/⚠️ | N |
| Authorization | ✅/⚠️ | N |
| Rate limiting & CORS | ✅/⚠️ | N |
| Hassas veri loglama | ✅/⚠️ | N |
| Hardcode secret | ✅/⚠️ | N |

**Kritik (hemen düzeltilmeli) bulgular:**
**Önemli (yakında düzeltilmeli) bulgular:**
