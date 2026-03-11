# pre-commit-check
# Commit oncesi kod kalitesi ve guvenlik kontrolu yapar.
# TRIGGER: "commit oncesi kontrol", "push oncesi", "PR hazirligi", "kod kalitesi kontrol",
#   "pre-commit", "commit before check", "push before check", "quality check",
#   "kod kontrol et", "hata var mi", "build gecti mi"

## Gorev
Commit/push oncesi projenin tum katmanlarinda kalite ve guvenlik kontrolu yap.
Her adimi calistir, sonuclari ozet tablo olarak sun.

---

## Adim 1 — TypeScript Kontrolu (Frontend)

```bash
cd src/ECommerce.Web && npx tsc --noEmit
```

- Sifir hata hedefi
- Hata varsa dosya:satir listele

---

## Adim 2 — Backend Build

```bash
dotnet build ECommerce.sln --no-restore
```

- Sifir hata ve sifir warning hedefi
- Warning varsa uyari olarak listele

---

## Adim 3 — Backend Test

```bash
dotnet test ECommerce.sln --no-build
```

- Tum testler gecmeli
- Basarisiz test varsa isim + hata mesajini raporla

---

## Adim 4 — `any` Kullanimini Tara (Frontend)

`src/ECommerce.Web/src/` altinda `: any`, `as any`, `<any>` pattern'lerini ara.
- `any` kullanimi YASAK — her bulguyu dosya:satir olarak listele

---

## Adim 5 — Token Depolama Kontrolu (Frontend)

`src/ECommerce.Web/src/` altinda su pattern'leri ara:
- `localStorage.setItem` veya `sessionStorage.setItem` ile token/auth verisi → YASAK
- `document.cookie` ile manuel cookie yazimi → YASAK

---

## Adim 6 — Hardcode Secret Kontrolu

Tum proje genelinde su pattern'leri ara:
- Kaynak kodda hardcode JWT secret, connection string, API key
- `appsettings.json` icinde production secret degeri
- `.env` dosyalarinin `.gitignore`'da olup olmadigini dogrula

---

## Adim 7 — Hassas Veri Loglama (Backend)

`src/` altindaki `.cs` dosyalarinda su alanlar loglaniyorsa YASAK:
- `password`, `Password`, `cardNumber`, `cvv`, `token`, `refreshToken`
- `Console.WriteLine` kullanimi → YASAK (Serilog kullanilmali)

---

## Ozet Rapor

| Adim | Kontrol | Durum | Bulgu |
|------|---------|-------|-------|
| 1 | TypeScript | ✅/❌ | N hata |
| 2 | Backend build | ✅/❌ | N hata, N warning |
| 3 | Backend test | ✅/❌ | N basarisiz |
| 4 | `any` kullanimi | ✅/❌ | N bulgu |
| 5 | Token depolama | ✅/❌ | N bulgu |
| 6 | Hardcode secret | ✅/❌ | N bulgu |
| 7 | Hassas loglama | ✅/❌ | N bulgu |

Tum adimlar ✅ ise: "Commit/push icin hazir."
Herhangi biri ❌ ise: "Asagidaki sorunlar duzeltilmeden commit yapilmamali." + bulgu listesi
