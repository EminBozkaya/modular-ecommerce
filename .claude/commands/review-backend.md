# /review-backend
# Backend kod kalitesini, CQRS uyumunu, EF Core standartlarını ve loglama kurallarını inceler.
# Kullanım: Claude Code'da `/review-backend` yazın.

## Görev
Aşağıdaki adımları sırasıyla uygula. Her adımda bulguları raporla.
Format: "✅ Temiz" veya "⚠️ [dosya:satır] — açıklama"

---

## Adım 1 — CQRS Uyum Kontrolü

`ECommerce.Application/` altındaki tüm Command ve Query handler'larını tara:

**Command handler'lar için:**
- `IRequestHandler<TCommand, TResponse>` implement ediyor mu?
- Handler içinde Query işlemi (okuma) yapıyor mu? (karışık sorumluluk — UYARI)
- Return type tutarlı mı? (ApiResponse veya domain entity değil — DTO dönmeli)

**Query handler'lar için:**
- `AsNoTracking()` kullanıyor mu? (OLMASI GEREKEN)
- Domain entity'yi doğrudan döndürüyor mu? (UYARI — projection/DTO dönmeli)
- Gereksiz `Include()` zincirleri var mı?

---

## Adım 2 — FluentValidation Kontrolü

`ECommerce.Application/` altında her Command için bir Validator olup olmadığını kontrol et:

- Validator sınıfı var mı?
- `AbstractValidator<TCommand>` extend ediyor mu?
- Boş validator (hiç kural tanımlanmamış) var mı? (UYARI)
- Validation pipeline behavior kayıtlı mı? (`DI` kayıtlarını kontrol et)

---

## Adım 3 — EF Core Standart Kontrolü

`ECommerce.Persistence/` altındaki tüm entity configuration dosyalarını tara:

- Her entity için `IEntityTypeConfiguration<T>` mevcut mu?
- Soft delete için global query filter tanımlı mı? (`IsDeleted == false`)
- `AuditAndSoftDeleteInterceptor` kayıtlı mı?
- Hassas alanlar (password, token) `[Column]` ile doğru map edilmiş mi?
- Foreign key ilişkileri Fluent API ile mi tanımlı? (Data annotation — UYARI)

---

## Adım 4 — Serilog Loglama Kontrolü

Tüm handler ve service dosyalarını tara:

- `Console.WriteLine` veya `Debug.WriteLine` kullanımı → YASAK
- `ILogger<T>` yerine `Console` kullanımı → YASAK
- Log mesajlarında şu alanların geçip geçmediğini kontrol et:
  - `password`, `Password` → YASAK (loglanmamalı)
  - `cardNumber`, `cvv`, `CardNumber` → YASAK
  - `token`, `refreshToken` → YASAK
- Structured logging kullanılıyor mu? (`_logger.LogInformation("User {UserId}", id)` formatı)

---

## Adım 5 — Soft Delete Tutarlılık Kontrolü

Tüm domain entity'lerini tara:

- `BaseAuditableEntity`'den inherit ediyor mu?
- `IsDeleted` alanı var mı?
- Fiziksel `DELETE` SQL'i çalıştıran yer var mı? (YASAK)
- Global query filter her DbSet için aktif mi?

---

## Adım 6 — Nullable Reference Types Kontrolü

`ECommerce.API/`, `ECommerce.Application/` ve `ECommerce.Domain/` içinde:

- `#nullable enable` veya proje genelinde `<Nullable>enable</Nullable>` aktif mi?
- `null!` (null forgiving operator) kullanımı var mı? Varsa gerekçeli mi?
- `string?` yerine `string` kullanılan ancak null olabilecek alanlar var mı?

---

## Adım 7 — Exception Handling Kontrolü

- `ExceptionHandlingMiddleware` global olarak kayıtlı mı?
- Controller dışında `try/catch` ile yutulmuş (loglanmadan) exception var mı?
- Custom exception tipleri var mı ve tutarlı kullanılıyor mu?
- 500 hatalarında stack trace response'a sızıyor mu? (Production'da YASAK)

---

## Özet Rapor

| Adım | Durum | Bulgu Sayısı |
|------|-------|--------------|
| CQRS uyumu | ✅/⚠️ | N |
| FluentValidation | ✅/⚠️ | N |
| EF Core standartları | ✅/⚠️ | N |
| Serilog loglama | ✅/⚠️ | N |
| Soft delete | ✅/⚠️ | N |
| Nullable reference types | ✅/⚠️ | N |
| Exception handling | ✅/⚠️ | N |

Kritik bulgular varsa öncelik sırasına göre listele.
