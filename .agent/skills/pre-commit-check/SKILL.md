---
name: pre-commit-check
description: Commit öncesi kod kalitesi ve güvenlik kontrolü — TypeScript, .NET build, test, secret tarama
---

# Pre-Commit Check Skill'i

Commit/push öncesi projenin tüm katmanlarında kalite ve güvenlik kontrolü yapar.

---

## Adım 1 — TypeScript Kontrolü (Frontend)

```bash
cd src/ECommerce.Web && npx tsc --noEmit
```
Sıfır hata hedefi.

---

## Adım 2 — Backend Build

```bash
dotnet build ECommerce.sln --no-restore
```
Sıfır hata ve sıfır warning hedefi.

---

## Adım 3 — Backend Test

```bash
dotnet test ECommerce.sln --no-build
```
Tüm testler geçmeli.

---

## Adım 4 — `any` Kullanımını Tara (Frontend)

`src/ECommerce.Web/src/` altında `: any`, `as any`, `<any>` pattern'lerini ara.
`any` kullanımı YASAK.

---

## Adım 5 — Token Depolama Kontrolü (Frontend)

- `localStorage.setItem` veya `sessionStorage.setItem` ile token/auth verisi → YASAK
- `document.cookie` ile manuel cookie yazımı → YASAK

---

## Adım 6 — Hardcode Secret Kontrolü

- Kaynak kodda hardcode JWT secret, connection string, API key → YASAK
- `.env` dosyalarının `.gitignore`'da olduğunu doğrula

---

## Adım 7 — Hassas Veri Loglama (Backend)

- password, cardNumber, cvv, token loglanıyorsa → YASAK
- Console.WriteLine kullanımı → YASAK (Serilog kullanılmalı)

---

## Özet Rapor

| Adım | Kontrol | Durum | Bulgu |
|------|---------|-------|-------|
| 1 | TypeScript | ✅/❌ | N hata |
| 2 | Backend build | ✅/❌ | N hata |
| 3 | Backend test | ✅/❌ | N başarısız |
| 4 | `any` kullanımı | ✅/❌ | N bulgu |
| 5 | Token depolama | ✅/❌ | N bulgu |
| 6 | Hardcode secret | ✅/❌ | N bulgu |
| 7 | Hassas loglama | ✅/❌ | N bulgu |

Tüm adımlar ✅ ise: "Commit/push için hazır."
