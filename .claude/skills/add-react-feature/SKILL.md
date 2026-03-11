# add-react-feature
# React frontend'e yeni feature, component, hook veya sayfa ekler.
# TRIGGER: "component olustur", "hook yaz", "sayfa ekle", "frontend feature",
#   "React component", "yeni sayfa", "new page", "new component", "new hook",
#   "frontend ekle", "UI ekle", "ekran ekle", "form olustur"

## Gorev
Projenin frontend mimarisine uygun sekilde yeni feature/component/hook/page olustur.
Mevcut pattern'leri takip et: React Query + Zustand + Mock/Real toggle.

---

## Adim 1 — Kapsam Belirleme

Kullanicinin istegini analiz et:
- **Yeni feature** → tam klasor yapisi olustur
- **Mevcut feature'a ekleme** → ilgili klasore ekle
- **Bagimsiz shared component** → `src/components/shared/` altina ekle
- Scope belirsizse SOR — tahminle devam etme

---

## Adim 2 — Feature Klasor Yapisi (yeni feature icin)

```
src/features/{featureName}/
├── api/
│   ├── {featureName}Api.ts    # Mock/real toggle'li API fonksiyonlari
│   └── mock.ts                # Mock veri + gecikme simulasyonu
├── hooks/
│   └── use{Hook}.ts           # React Query hook'lari
├── components/
│   └── {Component}.tsx        # UI component'leri
├── pages/
│   └── {Page}Page.tsx         # Sayfa component'leri
└── types/
    └── {featureName}.ts       # Feature'a ozel tipler
```

---

## Adim 3 — API Katmani

**{featureName}Api.ts sablon:**
```typescript
import { apiClient } from '@/api/client';
// import mock fonksiyonlari

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getData(params: Params): Promise<ResponseType> {
  if (isMock) {
    // mock fonksiyonu cagir (400ms gecikme dahil)
  }
  const { data } = await apiClient.get<ResponseType>('/api/endpoint', { params });
  return data;
}
```

Kurallar:
- Dogrudan `fetch()` veya `axios` YASAK — sadece `apiClient`
- Mock fonksiyonlar `setTimeout` ile 300-600ms gecikme eklemeli
- Response tipleri kesinlikle tanimli olmali — `any` YASAK

---

## Adim 4 — React Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';

export function use{Name}(params) {
  return useQuery({
    queryKey: queryKeys.{feature}.{entity}.list(params),
    queryFn: () => getData(params),
  });
}
```

Kurallar:
- Query key'i `src/utils/queryKeys.ts`'e ekle — hardcode string YASAK
- Mutation sonrasi `invalidateQueries` ZORUNLU
- `staleTime` belirle

---

## Adim 5 — Component

```tsx
export function {Name}({ ... }: Props) {
  const { data, isLoading, error } = use{Name}();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title="..." />;

  return ( /* UI */ );
}
```

Kurallar:
- Loading + Error + Empty state ZORUNLU (uc durum da handle edilmeli)
- 150 satirdan uzun component YASAK — bol
- Component icinde dogrudan API cagrisi YASAK — hook kullan
- `any` YASAK — prop tipleri tanimla
- `useEffect` icinde veri fetch YASAK — React Query kullan

---

## Adim 6 — Sayfa + Router

Yeni sayfa eklendiyse `src/app/router/index.tsx`'e route ekle:
- Public sayfa → dogrudan ekle
- Auth gerektiren → `<ProtectedRoute>` ile sar
- Admin sayfasi → `<ProtectedRoute allowedRoles={['Admin']}>` + `/admin` prefix

---

## Adim 7 — Dogrulama

```bash
cd src/ECommerce.Web && npx tsc --noEmit
```

Sifir hata ile gecmeli.

---

## Kontrol Listesi
- [ ] `any` kullanilmamis
- [ ] API fonksiyonlari `apiClient` uzerinden
- [ ] Mock/real toggle mevcut
- [ ] Query key'ler `queryKeys.ts`'te tanimli
- [ ] Loading + Error + Empty state handle ediliyor
- [ ] Component 150 satir altinda
- [ ] Route eklendiyse ProtectedRoute uygun
- [ ] `npx tsc --noEmit` sifir hata
