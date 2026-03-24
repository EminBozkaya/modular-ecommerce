---
name: i18n-aware
description: Çok dilli (TR/EN/DE/FR/ES/RU/AR) i18n desteği ile UI bileşeni oluşturma veya güncelleme
---

# i18n-Aware Development Skill

Yeni UI bileşeni, sayfa, modal veya form oluşturulurken ya da mevcut bileşenlere metin eklenirken
projedeki çok dilli destek altyapısıyla tam uyumlu kod üretilmesini sağlar.

**7 aktif dil:** tr · en · de · fr · es · ru · ar

---

## Adım 1 — Desteklenen Dilleri Oku

**Her zaman ilk adım:** `src/i18n/languages.ts` dosyasını oku.
Dosyayı okumadan önce varsayım yapma — dil listesi değişmiş olabilir.

---

## Adım 2 — Namespace Belirle

| Domain | Namespace |
|--------|-----------|
| Navbar, footer, genel butonlar | `common` |
| Giriş, kayıt, profil | `auth` |
| Ürün listesi, detay | `catalog` |
| Sepet | `basket` |
| Adres, ödeme | `checkout` |
| Sipariş geçmişi | `orders` |
| Admin panel | `admin` |
| Form hata mesajları | `validation` |

---

## Adım 3 — JSON Dosyalarını Güncelle

1. İlgili namespace JSON'larını okuyarak mevcut key'leri belirle
2. Key varsa: sadece bileşeni güncelle
3. Key yoksa: **tüm 7 dile ekle** — eksik key bırakma

```
src/i18n/locales/
├── tr/<namespace>.json   ← kaynak — önce bunu oku
├── en/<namespace>.json
├── de/<namespace>.json
├── fr/<namespace>.json
├── es/<namespace>.json
├── ru/<namespace>.json
└── ar/<namespace>.json
```

**Arapça için gerçek Arapça metin yaz. Rusça için gerçek Kiril yaz.**

---

## Adım 4 — Bileşende Kullanım

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('admin');
<h2>{t('newFeature.title')}</h2>
```

**Module-level array'ler hook kullanamaz — component içine taşı.**
**Default prop'lar için içeride resolve pattern'i kullan.**

---

## Adım 5 — Tarih ve Sayı Formatları

Hardcode locale kullanma — `i18n.language`'a göre dinamik belirle.

---

## YASAK Kullanım

```tsx
// ❌ Hardcode string
<button>Kaydet</button>

// ✅ i18n
<button>{t('buttons.save', { ns: 'common' })}</button>
```

---

## Kontrol Listesi
- [ ] `src/i18n/languages.ts` okundu
- [ ] Tüm görünen metinler `t()` ile sarıldı
- [ ] Her dil için JSON dosyasına key eklendi
- [ ] Tarih/sayı formatları dinamik locale kullanıyor
- [ ] `npx tsc --noEmit` → 0 hata
