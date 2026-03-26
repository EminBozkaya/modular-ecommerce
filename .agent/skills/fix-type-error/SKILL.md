---
name: fix-type-error
description: TypeScript ve .NET derleme hatalarını tespit edip düzeltir — any kullanmak YASAK
---

# Tip Hatası Düzeltme Skill'i

TypeScript veya .NET derleme hatalarını tespit et, analiz et, düzelt.
`any` kullanmak YASAK — her zaman doğru tipi bul.

---

## Adım 1 — Hata Tespiti

**Frontend:**
```bash
cd src/ECommerce.Web && npx tsc --noEmit
```

**Backend:**
```bash
dotnet build ECommerce.sln --no-restore
```

---

## Adım 2 — Analiz

1. İlgili dosyayı oku
2. Kök nedeni tespit et (yanlış tip, eksik import, uyumsuz DTO vb.)
3. Çözüm stratejisi belirle

---

## Adım 3 — Düzeltme Kuralları

**Frontend (TypeScript):**
- `any` YASAK — `unknown` + type guard kullan
- `// @ts-ignore` YASAK
- Yeni tip gerekiyorsa feature'ın `types/` klasörüne ekle

**Backend (.NET):**
- Nullable reference type uyumsuzlukları için `string?` veya null guard kullan
- DTO record tipleri immutable kalmalı
- Domain entity'lerinde public setter YASAK

---

## Adım 4 — Doğrulama

Sıfır hata gelene kadar Adım 2-4'ü tekrarla.
3 denemeden sonra çözülemiyorsa DUR ve kullanıcıya sor.

---

## Özet Rapor

| Dosya | Satır | Hata | Çözüm | Durum |
|-------|-------|------|-------|-------|
| path | N | açıklama | yapılan düzeltme | ✅/❌ |
