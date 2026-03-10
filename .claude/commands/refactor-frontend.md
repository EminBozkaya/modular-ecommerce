# /refactor-frontend
# Frontend'deki tespit edilmiş sorunları aktif olarak düzeltir.
# KULLANMADAN ÖNCE: /review-frontend çalıştırın.
# Kullanım: Claude Code'da `/refactor-frontend` yazın.

## ÖNEMLİ
Bu komut kod değiştirir. Çalıştırmadan önce:
1. `git status` ile temiz bir branch'te olduğunuzu doğrulayın
2. `/review-frontend` çıktısını hazırda bulundurun
3. Hangi adımları uygulayacağınızı belirtin

---

## Adım 1 — Doğrudan API Çağrılarını Temizle

`/review-frontend` Adım 1'de tespit edilen component içi `fetch`/`axios` çağrıları için:

Her sorunlu component için:
1. HTTP çağrısını ilgili feature'ın `api/` klasörüne taşı
2. React Query hook'una wrap et
3. Component'te yalnızca hook çağrısı bırak
4. `npx tsc --noEmit` ile tip hatası olmadığını doğrula

---

## Adım 2 — State Karışıklığını Düzelt

`/review-frontend` Adım 2'de tespit edilen server state / client state karışıklığı için:

**Zustand'a giren server verisi için:**
1. Zustand store'dan ilgili alanı kaldır
2. React Query hook'una taşı
3. Zustand'ı kullanan component'leri React Query'ye geçir

**useEffect ile fetch eden kod için:**
1. `useEffect` + `setState` pattern'ini React Query `useQuery` ile değiştir
2. Loading ve error state'leri React Query'den al

---

## Adım 3 — TypeScript `any` Kullanımını Temizle

`/review-frontend` Adım 3'te tespit edilen `any` kullanımları için:

Her `any` için:
1. Gerçek tipi tespit et
2. Gerekirse `src/features/*/types/` altına yeni tip ekle
3. `any` yerine spesifik tipi koy
4. `npx tsc --noEmit` ile doğrula

---

## Adım 4 — Eksik Async State'leri Tamamla

`/review-frontend` Adım 4'te tespit edilen eksik loading/error/empty state'ler için:

Her eksik state için ilgili component'e:
1. `isLoading` → `<LoadingSpinner />` göster
2. `error` → `<ErrorMessage message={...} onRetry={...} />` göster
3. `data` boş array → `<EmptyState title={...} />` göster
4. Üç durum da mevcut değilse component'i yeniden yapılandır

---

## Adım 5 — Query Key Tutarlılığını Sağla

`/review-frontend` Adım 2'de tespit edilen hardcode query key'ler için:

1. `src/utils/queryKeys.ts` dosyasını aç
2. Eksik key'leri ekle
3. Hardcode string kullanan query'leri `queryKeys.*` ile değiştir
4. `invalidateQueries` çağrılarını da güncelle

---

## Adım 6 — God Component'leri Böl

`/review-frontend` Adım 4'te tespit edilen aşırı büyük component'ler için:

Her sorunlu component için:
1. Sorumlulukları tespit et
2. Alt component'lere böl
3. Her alt component tek bir iş yapmalı
4. Hook'ları ayrı dosyaya çıkar
5. 150 satır altına indir

**DUR ve sor:** Bölme planını göster, onay al, sonra uygula.

---

## Sonuç Doğrulama

Tüm adımlar tamamlandıktan sonra:

```bash
npx tsc --noEmit
npm run build
```

Her ikisi de sıfır hata ile geçmeli.
Geçmiyorsa DUR ve hataları raporla.
