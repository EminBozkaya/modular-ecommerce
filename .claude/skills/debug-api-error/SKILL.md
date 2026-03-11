# debug-api-error
# Frontend-backend arasindaki API hatalarini tespit ve cozumler.
# TRIGGER: "API hatasi", "401 hatasi", "403 hatasi", "404 hatasi", "500 hatasi",
#   "CORS hatasi", "axios error", "network error", "backend hata", "endpoint calismadi",
#   "request failed", "istek basarisiz", "API error", "sunucu hatasi", "forbidden",
#   "unauthorized", "cookie gelmiyor", "token gecersiz"

## Gorev
API hatalarini sistematik olarak teshis et. Hata koduna gore arastirma yap,
hem frontend hem backend tarafini incele, kok nedeni tespit et.

---

## Adim 1 — Hata Siniflandirma

Kullanicinin verdigi bilgiden hata turunu belirle:

| Kod | Olasi Neden | Inceleme Alani |
|-----|-------------|----------------|
| 401 | JWT cookie eksik/suresi dolmus | Auth flow, cookie ayarlari |
| 403 | Rol yetersiz | [Authorize(Roles)] attribute |
| 404 | Endpoint mevcut degil / URL yanlis | Route tanimlarilari |
| 500 | Backend exception | ExceptionHandlingMiddleware + handler |
| CORS | Origin beyaz listede degil | Program.cs CORS politikasi |
| Network | Backend kapali / URL yanlis | VITE_API_BASE_URL, backend calisma durumu |

---

## Adim 2 — Frontend Tarafini Incele

**API cagrisini bul:**
- `src/features/*/api/` altindaki ilgili fonksiyonu oku
- `apiClient` uzerinden mi cagriliyor? (dogrudan axios/fetch YASAK)
- URL path dogru mu? (trailing slash, case sensitivity)
- HTTP method dogru mu? (GET/POST/PUT/DELETE)
- Request body/params format uyumlu mu? (camelCase vs snake_case)

**Cookie/Auth kontrolu:**
- `src/api/client.ts` → `withCredentials: true` var mi?
- 401 interceptor dogru calisiyor mu?
- `useInitAuth` → `/api/auth/me` cagrisi basarili mi?

**Mock/Real toggle:**
- `VITE_USE_MOCK_API` degeri ne? Mock modundaysa gercek backend'e istek gitmez
- `.env.development.local` dosyasini kontrol et

---

## Adim 3 — Backend Tarafini Incele

**Controller endpoint'ini bul:**
- `src/ECommerce.API/Controllers/` altinda ilgili route var mi?
- `[HttpGet/Post/Put/Delete("route")]` dogru mu?
- `[Authorize]` veya `[Authorize(Roles = "Admin")]` gerekli yerde var mi?
- `[AllowAnonymous]` gereksiz yerde kullanilmis mi?

**Handler'i incele:**
- MediatR handler exception atabilir mi?
- Repository null donebilir mi? (null check eksik mi?)
- Validation pipeline'da hata olabilir mi?

**Middleware kontrolu:**
- `ExceptionHandlingMiddleware` kayitli mi? (`Program.cs`)
- CORS politikasi: `AllowAnyOrigin()` YASAK — whitelist olmali
- Rate limiting: 100 req/min limitine takilmis olabilir mi?

---

## Adim 4 — DTO Uyumluluk Kontrolu

Frontend'in gonderdigi/bekledigi shape ile backend'in kabul ettigi/dondurdugu shape'i karsilastir:
- Alan isimleri eslessiyor mu? (camelCase frontend ↔ PascalCase backend JSON serialize)
- Null/not-null uyumu var mi?
- Enum degerleri birebir eslessiyor mu?
- Pagination parametreleri (`page`, `pageSize`) uyumlu mu?

---

## Adim 5 — Bilinen Eksik Endpoint Kontrolu

Backend'de henuz implement edilmemis endpoint'ler:
- `GET /api/auth/me` — session restore
- `GET /api/orders/my` — musteri siparis gecmisi
- `GET /api/orders/my/{id}` — tekil siparis detayi

Frontend bunlari cagiriyorsa mock modunda olmali. Real modda 404 beklenir.

---

## Adim 6 — Cozum Raporu

| Katman | Bulgu | Cozum |
|--------|-------|-------|
| Frontend | aciklama | yapilacak duzeltme |
| Backend | aciklama | yapilacak duzeltme |
| Konfigürasyon | aciklama | yapilacak duzeltme |

**Kok Neden:** Tek cumlelik ozet
**Onerilen Duzeltme:** Adim adim talimatlar
