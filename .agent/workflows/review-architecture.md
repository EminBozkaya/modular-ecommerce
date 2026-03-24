---
description: Projenin genel mimari sağlığını katman bağımlılıkları ve DDD uyumu açısından inceler
---

# Mimari İnceleme (Review Architecture)

Aşağıdaki adımları sırasıyla uygula. Her adım için bulgularını raporla.
Sorun bulamazsan "✅ Temiz" yaz. Sorun bulursan "⚠️ [dosya:satır] — açıklama" formatında listele.
Tüm adımlar bittikten sonra özet bir tablo sun.

---

## Adım 1 — Katman Bağımlılık Kontrolü

Aşağıdaki kuralların ihlal edilip edilmediğini `*.csproj` dosyalarını inceleyerek kontrol et:

- `ECommerce.Domain` → hiçbir projeye referans vermemeli
- `ECommerce.Application` → yalnızca `Domain`'e referans vermeli
- `ECommerce.Persistence` → yalnızca `Domain`'e referans vermeli (`Application`'a HAYIR)
- `ECommerce.Infrastructure` → `Domain` ve `Application`'a referans verebilir
- `ECommerce.API` → `Application`, `Persistence`, `Infrastructure`'a referans verebilir

İhlal varsa hangi `.csproj` dosyasında, hangi referansın fazladan eklendiğini belirt.

---

## Adım 2 — Domain Saflık Kontrolü

`ECommerce.Domain/` altındaki tüm `.cs` dosyalarını tara:

- `using Microsoft.EntityFrameworkCore` → YASAK
- `using Microsoft.AspNetCore` → YASAK
- `using System.Data` → YASAK
- Infrastructure namespace'lerine herhangi bir referans → YASAK

Her ihlal için dosya adı ve satır numarasını raporla.

---

## Adım 3 — Application Katmanı Saflık Kontrolü

`ECommerce.Application/` altındaki tüm `.cs` dosyalarını tara:

- `DbContext` veya `ApplicationDbContext` kullanımı → YASAK
- `HttpContext` kullanımı → YASAK
- `IConfiguration` inject edilmesi → YASAK
- EF Core namespace'leri (`Microsoft.EntityFrameworkCore`) → YASAK

---

## Adım 4 — Controller İçerik Kontrolü

`ECommerce.API/Controllers/` altındaki tüm controller'ları tara:

- `if/else` iş mantığı bloğu → YASAK (sadece orchestration olmalı)
- Domain entity'lerine doğrudan erişim → YASAK
- Repository çağrısı → YASAK (sadece MediatR `Send` olmalı)
- `try/catch` bloğu → YASAK (middleware halleder)

---

## Adım 5 — Aggregate Repository Kontrolü

`ECommerce.Domain/` altında repository interface'lerini bul.
`ECommerce.Persistence/` altında implementasyonlarını bul.

Kontrol et:
- Her aggregate'in kendi spesifik repository interface'i var mı?
- Generic `IRepository<T>` kullanımı var mı? (YASAK)
- Interface Domain'de, implementasyon Persistence'da mı? (OLMASI GEREKEN)

---

## Adım 6 — Value Object Kontrolü

`Money` ve `StockQuantity` value object'lerini bul ve kontrol et:
- Immutable mu? (setter yok veya `init` only)
- Equality doğru implement edilmiş mi? (`Equals` + `GetHashCode`)
- Primitive obsession var mı? (price için `decimal` yerine `Money` kullanılıyor mu?)

---

## Özet Rapor

Tüm adımlar tamamlandıktan sonra şu formatla özetle:

| Adım | Durum | Bulgu Sayısı |
|------|-------|--------------|
| Katman bağımlılıkları | ✅/⚠️ | N |
| Domain saflığı | ✅/⚠️ | N |
| Application saflığı | ✅/⚠️ | N |
| Controller içeriği | ✅/⚠️ | N |
| Repository pattern | ✅/⚠️ | N |
| Value objects | ✅/⚠️ | N |

Kritik bulgular varsa öncelik sırasına göre listele.
