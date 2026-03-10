# /review-api-contracts
# Frontend'in beklediği API shape'leri ile backend'in gerçekte döndürdüklerini karşılaştırır.
# Mock'tan gerçek backend'e geçişte uyumsuzlukları önceden tespit eder.
# Kullanım: Claude Code'da `/review-api-contracts` yazın.

## Görev
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
  - `items`, `totalCount`, `page`, `pageSize` alanları var mı?
- `ProductListParams` query parametreleri backend'in kabul ettiği parametrelerle uyuşuyor mu?

---

## Adım 2 — Auth Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/auth/types/auth.ts`
**Backend DTO:** `ECommerce.Application/Identity/Commands/` ve `ECommerce.API/Controllers/`

Karşılaştır:
- `LoginRequest` → backend `LoginCommand`/DTO field isimleri eşleşiyor mu?
- `RegisterRequest` → backend field isimleri eşleşiyor mu?
- `AuthResponse.user` → backend'in döndürdüğü user shape'i eşleşiyor mu?
- `GET /api/auth/me` endpoint'i implement edilmiş mi? Response shape frontend `AuthUser` ile uyuşuyor mu?

---

## Adım 3 — Basket Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/basket/types/basket.ts`
**Backend DTO:** `ECommerce.Application/Basket/` altındaki response'lar

Karşılaştır:
- `Basket.items` → `BasketItem[]` shape eşleşiyor mu?
- `BasketItem.unitPriceSnapshot` → backend field adı aynı mı? (case-sensitive)
- `BasketItem.currency` → backend döndürüyor mu?
- `Basket.totalAmount` → backend hesaplayıp döndürüyor mu, yoksa frontend mi hesaplıyor?
- `AddToBasketRequest` → backend'in beklediği body ile eşleşiyor mu?

---

## Adım 4 — Ordering Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/ordering/types/`
**Backend DTO:** `ECommerce.Application/Ordering/` altındaki response'lar

Karşılaştır:
- `CreateOrderRequest.shippingAddress` → backend field isimleri eşleşiyor mu?
- `CreateOrderResponse.orderId` → backend `orderId` mi döndürüyor, `id` mi?
- `PaymentRequest` field isimleri backend ile eşleşiyor mu?
- `Order.status` enum değerleri backend `OrderStatus` enum ile birebir eşleşiyor mu?
  - Frontend: `'Pending' | 'PaymentProcessing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'`
  - Backend enum değerleri neler?
- `GET /api/orders/my` ve `GET /api/orders/my/{id}` endpoint'leri implement edilmiş mi?

---

## Adım 5 — Admin Endpoint Kontratları

**Frontend tipi:** `src/ECommerce.Web/src/features/admin/types/`
**Backend:** `ECommerce.API/Controllers/Admin/`

Karşılaştır:
- Admin product create/update request field isimleri eşleşiyor mu?
- Stock update endpoint — body formatı nedir? Frontend ne gönderiyor?
- `GET /api/admin/users` response'u → `AdminUser` shape ile uyuşuyor mu?
- `GET /api/admin/orders` → pagination parametreleri destekleniyor mu?
- Dashboard endpoint'leri (`/api/admin/dashboard/summary` vb.) implement edilmiş mi?

---

## Adım 6 — HTTP Method & URL Uyumu

Frontend `src/ECommerce.Web/src/features/*/api/` dosyalarındaki gerçek API çağrılarını (mock değil) tara:

Her çağrı için:
- URL path doğru mu? (trailing slash, case sensitivity)
- HTTP method doğru mu?
- Query parametreler doğru formatta mı? (camelCase vs snake_case)
- Request body JSON serialize uyumu var mı?

---

## Adım 7 — Eksik Backend Endpoint Listesi

Bu sohbet boyunca tespit edilen, frontend'in beklediği ancak backend'de henüz implement edilmemiş endpoint'leri listele:

Bilinen eksikler:
- `GET /api/auth/me`
- `GET /api/orders/my`
- `GET /api/orders/my/{id}`
- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/recent-orders`
- `GET /api/admin/dashboard/low-stock`

Kod taramasında başka eksik tespit edersen ekle.

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
| Eksik backend endpoint | — | N |

**Backend geçişinden önce mutlaka düzeltilmesi gerekenler:**
