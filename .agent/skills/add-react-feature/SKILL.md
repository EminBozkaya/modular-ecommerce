---
name: add-react-feature
description: React frontend'e yeni feature, component, hook veya sayfa ekler — Mock/Real toggle ile
---

# React Feature Ekleme Skill'i

Projenin frontend mimarisine uygun şekilde yeni feature/component/hook/page oluşturur.
Mevcut pattern'leri takip eder: React Query + Zustand + Mock/Real toggle.

---

## Adım 1 — Kapsam Belirleme

- **Yeni feature** → tam klasör yapısı oluştur
- **Mevcut feature'a ekleme** → ilgili klasöre ekle
- **Bağımsız shared component** → `src/components/shared/` altına ekle
- Scope belirsizse SOR

---

## Adım 2 — Feature Klasör Yapısı

```
src/features/{featureName}/
├── api/
│   ├── {featureName}Api.ts    # Mock/real toggle'lı API fonksiyonları
│   └── mock.ts                # Mock veri + gecikme simülasyonu
├── hooks/
│   └── use{Hook}.ts           # React Query hook'ları
├── components/
│   └── {Component}.tsx        # UI component'leri
├── pages/
│   └── {Page}Page.tsx         # Sayfa component'leri
└── types/
    └── {featureName}.ts       # Feature'a özel tipler
```

---

## Adım 3 — API Katmanı

- Doğrudan `fetch()` veya `axios` YASAK — sadece `apiClient`
- Mock fonksiyonlar `setTimeout` ile 300-600ms gecikme eklemeli
- Response tipleri kesinlikle tanımlı olmalı — `any` YASAK

---

## Adım 4 — React Query Hook

- Query key'i `src/utils/queryKeys.ts`'e ekle — hardcode string YASAK
- Mutation sonrası `invalidateQueries` ZORUNLU
- `staleTime` belirle

---

## Adım 5 — Component

- Loading + Error + Empty state ZORUNLU
- 150 satırdan uzun component YASAK — böl
- Component içinde doğrudan API çağrısı YASAK — hook kullan
- `any` YASAK — prop tipleri tanımla
- `useEffect` içinde veri fetch YASAK — React Query kullan

---

## Adım 6 — Router

- Public sayfa → doğrudan ekle
- Auth gerektiren → `<ProtectedRoute>` ile sar
- Admin sayfası → `<ProtectedRoute allowedRoles={['Admin']}>` + `/admin` prefix

---

## Kontrol Listesi
- [ ] `any` kullanılmamış
- [ ] API fonksiyonları `apiClient` üzerinden
- [ ] Mock/real toggle mevcut
- [ ] Query key'ler `queryKeys.ts`'te tanımlı
- [ ] Loading + Error + Empty state handle ediliyor
- [ ] Component 150 satır altında
- [ ] `npx tsc --noEmit` sıfır hata
