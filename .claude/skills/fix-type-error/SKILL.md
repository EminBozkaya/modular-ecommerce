# fix-type-error
# TypeScript ve .NET derleme hatalarini tespit edip duzeltir.
# TRIGGER: "tip hatasi", "type error", "TypeScript hatasi", "tsc hatasi", "TS error",
#   "derleme hatasi", "build hatasi", "compile error", "tsc noEmit", "dotnet build hatasi",
#   "tip uyumsuzlugu", "type mismatch", "cannot assign", "is not assignable"

## Gorev
TypeScript veya .NET derleme hatalarini tespit et, analiz et, duzelt.
`any` kullanmak YASAK — her zaman dogru tipi bul.

---

## Adim 1 — Hata Tespiti

**Frontend icin:**
```bash
cd src/ECommerce.Web && npx tsc --noEmit 2>&1
```

**Backend icin:**
```bash
dotnet build ECommerce.sln --no-restore 2>&1
```

Hatalari parse et, dosya:satir:mesaj formatinda listele.

---

## Adim 2 — Analiz (Her hata icin)

1. Ilgili dosyayi oku
2. Hatanin kok nedenini tespit et (yanlis tip, eksik import, uyumsuz DTO, vb.)
3. Cozum stratejisini belirle:
   - Tip tanimlanmamissa → `src/types/` veya `features/*/types/` altina ekle
   - DTO uyumsuzlugu → backend response shape'ini kontrol et
   - Null/undefined → optional chaining veya guard ekle (`any` YASAK)

---

## Adim 3 — Duzeltme Kurallari

**Frontend (TypeScript):**
- `any` YASAK — `unknown` + type guard veya spesifik tip kullan
- `// @ts-ignore` YASAK
- Yeni tip gerekiyorsa feature'in `types/` klasorune ekle
- API response tipleri `src/types/api.ts` veya feature types'a gitmeli
- React Query hook donus tipleri generic olarak belirtilmeli

**Backend (.NET):**
- Nullable reference type uyumsuzluklari icin `string?` veya null guard kullan
- `null!` sadece gercekten gerekli yerlerde — gerekce belirt
- DTO record tipleri immutable kalmali
- Domain entity'lerinde public setter YASAK

---

## Adim 4 — Dogrulama

Duzeltme sonrasi ilgili komutu tekrar calistir:
```bash
# Frontend
cd src/ECommerce.Web && npx tsc --noEmit

# Backend
dotnet build ECommerce.sln --no-restore
```

Sifir hata gelene kadar Adim 2-4'u tekrarla.
3 denemeden sonra cozulemiyorsa DUR ve kullaniciya sor.

---

## Ozet Rapor

| Dosya | Satir | Hata | Cozum | Durum |
|-------|-------|------|-------|-------|
| path | N | aciklama | yapilan duzeltme | ✅/❌ |
