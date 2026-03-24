---
description: Frontend sorunlarını (API izolasyon, state karışıklığı, TypeScript any, God component vb.) aktif olarak düzeltir
---

# Frontend Refactoring

## ÖNEMLİ
Bu workflow kod değiştirir. Çalıştırmadan önce:
1. `git status` ile temiz bir branch'te olduğunuzu doğrulayın
2. `/review-frontend` çıktısını hazırda bulundurun
3. Hangi adımları uygulayacağınızı belirtin

---

## Adım 1 — Doğrudan API Çağrılarını Temizle

1. HTTP çağrısını ilgili feature'ın `api/` klasörüne taşı
2. React Query hook'una wrap et
3. Component'te yalnızca hook çağrısı bırak
4. `npx tsc --noEmit` ile tip hatası olmadığını doğrula

---

## Adım 2 — State Karışıklığını Düzelt

**Zustand'a giren server verisi için:**
1. Zustand store'dan ilgili alanı kaldır
2. React Query hook'una taşı

**useEffect ile fetch eden kod için:**
1. `useEffect` + `setState` pattern'ini React Query `useQuery` ile değiştir

---

## Adım 3 — TypeScript `any` Kullanımını Temizle

1. Gerçek tipi tespit et
2. `src/features/*/types/` altına yeni tip ekle
3. `any` yerine spesifik tipi koy
4. `npx tsc --noEmit` ile doğrula

---

## Adım 4 — Eksik Async State'leri Tamamla

1. `isLoading` → `<LoadingSpinner />` göster
2. `error` → `<ErrorMessage />` göster
3. `data` boş array → `<EmptyState />` göster

---

## Adım 5 — Query Key Tutarlılığını Sağla

1. `src/utils/queryKeys.ts` dosyasına eksik key'leri ekle
2. Hardcode string kullanan query'leri `queryKeys.*` ile değiştir
3. `invalidateQueries` çağrılarını da güncelle

---

## Adım 6 — God Component'leri Böl

1. Sorumlulukları tespit et
2. Alt component'lere böl
3. Hook'ları ayrı dosyaya çıkar
4. 150 satır altına indir

**DUR ve sor:** Bölme planını göster, onay al, sonra uygula.

---

## Sonuç Doğrulama

```bash
npx tsc --noEmit
npm run build
```

Her ikisi de sıfır hata ile geçmeli.
Geçmiyorsa DUR ve hataları raporla.
