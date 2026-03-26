---
description: Frontend mimari kurallarını, state yönetimini, component kalitesini ve UX standartlarını inceler
---

# Frontend İnceleme (Review Frontend)

`src/ECommerce.Web/src/` altındaki tüm frontend kodunu aşağıdaki adımlarla incele.
Format: "✅ Temiz" veya "⚠️ [dosya:satır] — açıklama"

---

## Adım 1 — API Katmanı İzolasyon Kontrolü

Tüm `.tsx` ve `.ts` dosyalarını tara:

- `fetch(` doğrudan çağrısı → YASAK
- `axios.get(`, `axios.post(` doğrudan çağrısı → YASAK (sadece `apiClient` üzerinden)
- `src/api/client.ts` bypass eden HTTP çağrısı → YASAK

`src/api/client.ts` kontrolü:
- `withCredentials: true` var mı?
- 401 interceptor → `/login`'e yönlendiriyor mu?
- 500 interceptor → sadece development'ta mı log atıyor?

---

## Adım 2 — State Yönetimi Kontrolü

**Zustand store dosyalarını** (`src/store/`) tara:
- Server'dan gelen veri (ürün listesi, sipariş, kullanıcı detayı vb.) store'da tutuluyor mu? → YASAK
- `authStore` yalnızca `{ user, isAuthenticated, isAuthLoading }` mu? Token alanı var mı? → YASAK

**React Query kullanımını** tara:
- `queryKeys.ts` kullanılmadan hardcode string key var mı? → UYARI
- `staleTime` tanımlanmamış query var mı? → UYARI
- Mutation sonrası `invalidateQueries` çağrılıyor mu?

**useEffect kullanımını** tara:
- `useEffect` içinde veri fetch eden kod var mı? → YASAK (React Query kullanılmalı)
- `useEffect` içinde iş mantığı var mı? → YASAK

---

## Adım 3 — TypeScript Sağlamlık Kontrolü

Tüm dosyaları tara:

- `any` tip kullanımı → YASAK
- `// @ts-ignore` → YASAK
- `// @ts-expect-error` → gerekçesi yoksa UYARI
- Tip assertion (`as SomeType`) kullanımı → aşırı kullanım UYARI
- API response'ları için tip tanımı eksik mi?

---

## Adım 4 — Component Sorumluluk Kontrolü

Tüm `.tsx` bileşenlerini tara:

**God component işaretleri:**
- 150 satırdan uzun component → UYARI (incelenmeli)
- Birden fazla `useQuery` veya `useMutation` çağrısı aynı component içinde → UYARI
- Doğrudan `apiClient` çağrısı component içinde → YASAK

**Async state kontrolü:**
Veri çeken her component için `isLoading`, `error`, `empty` durumları handle ediliyor mu?
Eksik olan durumu belirt.

---

## Adım 5 — Güvenlik Kontrolü (Frontend)

- `localStorage.setItem` veya `sessionStorage.setItem` ile token/kullanıcı verisi saklama → YASAK
- `console.log` ile hassas veri basma (`password`, `token`, `card`) → YASAK
- `VITE_` prefix'siz environment variable kullanımı → UYARI
- Hardcode API URL (`.env` yerine) → YASAK

---

## Adım 6 — Route Guard Kontrolü

`src/app/router/` ve `ProtectedRoute.tsx` dosyalarını incele:

- `/admin` altındaki tüm route'lar `ProtectedRoute allowedRoles={['Admin']}` ile sarılı mı?
- `/checkout`, `/orders` route'ları `ProtectedRoute` ile sarılı mı?
- `?redirect=` param desteği doğru çalışıyor mu?

---

## Adım 7 — Mock/Real Toggle Kontrolü

Her feature'ın `api/` klasörünü tara:

- `VITE_USE_MOCK_API` kontrolü her API fonksiyonunda var mı?
- Mock fonksiyonlar simüle gecikme (setTimeout) kullanıyor mu?
- Mock veri gerçek backend response shape'ine uygun mu?

---

## Özet Rapor

| Adım | Durum | Bulgu Sayısı |
|------|-------|--------------|
| API izolasyonu | ✅/⚠️ | N |
| State yönetimi | ✅/⚠️ | N |
| TypeScript sağlamlığı | ✅/⚠️ | N |
| Component sorumluluğu | ✅/⚠️ | N |
| Güvenlik | ✅/⚠️ | N |
| Route guard | ✅/⚠️ | N |
| Mock/real toggle | ✅/⚠️ | N |

Kritik bulgular varsa öncelik sırasına göre listele.
