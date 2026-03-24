---
description: Frontend-backend API kontratlarını karşılaştırır, uyumsuzlukları tespit eder
---

# API Kontrat İncelemesi (Review API Contracts)

Frontend tip tanımlarını ve backend DTO/response'larını karşılaştır.
Her endpoint için uyumsuzlukları raporla.
Format: "✅ Eşleşiyor" veya "⚠️ Uyumsuzluk: [açıklama]"

---

## Adım 1 — Catalog Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/catalog/types/product.ts`
**Backend DTO:** `ECommerce.Application/Catalog/Queries/` altındaki response DTO'ları

Karşılaştır:
- `Product` alanları eşleşiyor mu? (alan isimleri, tipler, null/not-null)
- `Category` alanları eşleşiyor mu?
- `PaginatedResult<Product>` shape'i backend'in döndürdüğüyle örtüşüyor mu?
- `ProductListParams` query parametreleri backend'in kabul ettiği parametrelerle uyuşuyor mu?

---

## Adım 2 — Auth Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/auth/types/auth.ts`
**Backend DTO:** `ECommerce.Application/Identity/Commands/` ve `ECommerce.API/Controllers/`

Karşılaştır:
- `LoginRequest` → backend `LoginCommand`/DTO field isimleri eşleşiyor mu?
- `RegisterRequest` → backend field isimleri eşleşiyor mu?
- `AuthResponse.user` → backend'in döndürdüğü user shape'i eşleşiyor mu?
- `GET /api/auth/me` endpoint'i implement edilmiş mi?

---

## Adım 3 — Basket Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/basket/types/basket.ts`
**Backend DTO:** `ECommerce.Application/Basket/` altındaki response'lar

Karşılaştır:
- `Basket.items` → `BasketItem[]` shape eşleşiyor mu?
- `BasketItem.unitPriceSnapshot` → backend field adı aynı mı?
- `Basket.totalAmount` → backend hesaplayıp döndürüyor mu?
- `AddToBasketRequest` → backend'in beklediği body ile eşleşiyor mu?

---

## Adım 4 — Ordering Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/ordering/types/`
**Backend DTO:** `ECommerce.Application/Ordering/` altındaki response'lar

Karşılaştır:
- `CreateOrderRequest.shippingAddress` → backend field isimleri eşleşiyor mu?
- `Order.status` enum değerleri backend `OrderStatus` enum ile birebir eşleşiyor mu?
- `GET /api/orders/my` ve `GET /api/orders/my/{id}` endpoint'leri implement edilmiş mi?

---

## Adım 5 — Admin Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/admin/types/`
**Backend:** `ECommerce.API/Controllers/Admin/`

Karşılaştır:
- Admin product create/update request field isimleri eşleşiyor mu?
- `GET /api/admin/users` response'u → `AdminUser` shape ile uyuşuyor mu?
- Dashboard endpoint'leri implement edilmiş mi?

---

## Adım 6 — HTTP Method & URL Uyumu

Frontend `src/ECommerce.Web/src/features/*/api/` dosyalarındaki gerçek API çağrılarını tara:

- URL path doğru mu?
- HTTP method doğru mu?
- Query parametreler doğru formatta mı?
- Request body JSON serialize uyumu var mı?

---

## Özet Rapor

| Endpoint Grubu | Durum | Uyumsuzluk Sayısı |
|---|---|---|
| Catalog | ✅/⚠️ | N |
| Auth | ✅/⚠️ | N |
| Basket | ✅/⚠️ | N |
| Ordering | ✅/⚠️ | N |
| Admin | ✅/⚠️ | N |
| HTTP method/URL | ✅/⚠️ | N |

**Backend geçişinden önce mutlaka düzeltilmesi gerekenler:**
