---
name: debug-api-error
description: Frontend-backend arasındaki API hatalarını (401, 403, 404, 500, CORS) sistematik olarak teşhis ve çözümler
---

# API Hata Ayıklama Skill'i

API hatalarını sistematik olarak teşhis eder.
Hem frontend hem backend tarafını inceler, kök nedeni tespit eder.

---

## Adım 1 — Hata Sınıflandırma

| Kod | Olası Neden | İnceleme Alanı |
|-----|-------------|----------------|
| 401 | JWT cookie eksik/süresi dolmuş | Auth flow, cookie ayarları |
| 403 | Rol yetersiz | [Authorize(Roles)] attribute |
| 404 | Endpoint mevcut değil / URL yanlış | Route tanımları |
| 500 | Backend exception | ExceptionHandlingMiddleware + handler |
| CORS | Origin beyaz listede değil | Program.cs CORS politikası |
| Network | Backend kapalı / URL yanlış | VITE_API_BASE_URL |

---

## Adım 2 — Frontend Tarafını İncele

- `src/features/*/api/` altındaki ilgili fonksiyonu oku
- `apiClient` üzerinden mi çağrılıyor?
- URL path doğru mu?
- HTTP method doğru mu?
- `src/api/client.ts` → `withCredentials: true` var mı?

---

## Adım 3 — Backend Tarafını İncele

- İlgili route var mı?
- `[Authorize]` gerekli yerde var mı?
- MediatR handler exception atabilir mi?
- ExceptionHandlingMiddleware kayıtlı mı?

---

## Adım 4 — DTO Uyumluluk Kontrolü

- Alan isimleri eşleşiyor mu? (camelCase ↔ PascalCase)
- Null/not-null uyumu var mı?
- Enum değerleri eşleşiyor mu?

---

## Adım 5 — Çözüm Raporu

| Katman | Bulgu | Çözüm |
|--------|-------|-------|
| Frontend | açıklama | yapılacak düzeltme |
| Backend | açıklama | yapılacak düzeltme |
| Konfigürasyon | açıklama | yapılacak düzeltme |

**Kök Neden:** Tek cümlelik özet
**Önerilen Düzeltme:** Adım adım talimatlar
