# i18n-Aware Development Skill

## Açıklama
Bu skill, yeni UI bileşeni, sayfa, modal veya form oluşturulurken
ya da mevcut bileşenlere metin eklenirken otomatik tetiklenir.
Projedeki çok dilli destek altyapısıyla tam uyumlu kod üretilmesini sağlar.

## Tetiklenme Koşulları
- Yeni component, sayfa, modal veya form oluşturulurken
- Mevcut bileşene yeni UI metni eklenirken
- "component ekle", "sayfa ekle", "modal", "form", "yeni özellik"
- "add component", "add page", "new feature", "neue Komponente"

---

## ADIM 1 — Desteklenen Dilleri Oku

**Her zaman ilk adım:** `src/i18n/languages.ts` dosyasını oku.
Bu dosya projenin tek dil kaynağıdır — hangi dillerin aktif olduğu buradan belirlenir.

```ts
// Örnek yapı:
export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', locale: 'tr-TR', flag: '🇹🇷' },
  { code: 'en', label: 'English', locale: 'en-US', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE', flag: '🇩🇪' },
] as const;
```

Dosyayı okumadan önce varsayım yapma —
dil listesi değişmiş olabilir.

---

## ADIM 2 — Namespace Belirle

Bileşenin hangi domain'e ait olduğuna göre uygun namespace'i seç:

| Domain | Namespace | Örnek dosyalar |
|--------|-----------|----------------|
| Navbar, footer, genel butonlar | `common` | Kaydet, İptal, Yükleniyor |
| Giriş, kayıt, profil | `auth` | Giriş Yap, Şifre, E-posta |
| Ürün listesi, detay | `catalog` | Sepete Ekle, Stokta Var |
| Sepet, drawer | `basket` | Sepetim, Ödemeye Geç |
| Adres, ödeme | `checkout` | Teslimat Adresi, Sipariş Ver |
| Sipariş geçmişi | `orders` | Siparişlerim, Sipariş Detayı |
| Admin panel | `admin` | Ürünler, Düzenle, Sil |
| Form hata mesajları | `validation` | Zorunlu alan, Geçersiz e-posta |

Emin olamıyorsan `common` kullan.

---

## ADIM 3 — JSON Dosyalarını Güncelle

Yeni bir string eklenirken `src/i18n/languages.ts`'deki
**her dil** için ilgili namespace JSON dosyasına eklenmeli.

```
src/i18n/locales/
├── tr/<namespace>.json   ← Türkçe metin
├── en/<namespace>.json   ← İngilizce metin
└── de/<namespace>.json   ← Almanca metin
    ...                   ← languages.ts'deki diğer diller
```

**Kural:** Bir dil için eklenen key, diğer tüm dillere de eklenmeli.
Eksik key bırakma — fallback'e düşer, kullanıcı ham key görür.

Örnek — yeni `ProductReviewModal` için:
```json
// tr/catalog.json
"review": {
  "title": "Ürün Değerlendirmesi",
  "submit": "Değerlendirmeyi Gönder",
  "placeholder": "Ürün hakkında düşüncelerinizi yazın..."
}

// en/catalog.json
"review": {
  "title": "Product Review",
  "submit": "Submit Review",
  "placeholder": "Write your thoughts about the product..."
}

// de/catalog.json
"review": {
  "title": "Produktbewertung",
  "submit": "Bewertung absenden",
  "placeholder": "Schreiben Sie Ihre Gedanken zum Produkt..."
}
```

---

## ADIM 4 — Bileşende Kullanım

```tsx
import { useTranslation } from 'react-i18next';

// Tek namespace:
const { t } = useTranslation('catalog');

// Birden fazla namespace:
const { t } = useTranslation(['catalog', 'common']);

// Kullanım:
<h2>{t('review.title')}</h2>
<button>{t('review.submit')}</button>

// Parametre ile:
<p>{t('pagination.showing', { from: 1, to: 10, total: 50 })}</p>
```

---

## ADIM 5 — Tarih ve Sayı Formatları

Hardcode locale kullanma. `i18n.language`'a göre dinamik belirle:

```tsx
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

const { i18n } = useTranslation();

// Aktif dilin locale'ini bul
const currentLocale = SUPPORTED_LANGUAGES
  .find(l => l.code === i18n.language)?.locale ?? 'tr-TR';

// Tarih formatı:
date.toLocaleDateString(currentLocale)

// Para birimi:
amount.toLocaleString(currentLocale, { style: 'currency', currency: 'TRY' })
```

---

## YASAK KULLANIM

```tsx
// ❌ YANLIŞ — hardcode string
<button>Kaydet</button>
<p>Ürün bulunamadı</p>
<h1>Siparişlerim</h1>

// ❌ YANLIŞ — hardcode locale
date.toLocaleDateString('tr-TR')

// ✅ DOĞRU
<button>{t('buttons.save')}</button>
<p>{t('status.empty')}</p>
<h1>{t('orders.title')}</h1>
date.toLocaleDateString(currentLocale)
```

---

## KONTROL LİSTESİ

Bileşen tamamlanmadan önce:

- [ ] `src/i18n/languages.ts` okundu, aktif diller belirlendi
- [ ] Tüm görünen metinler `t()` ile sarıldı
- [ ] Her dil için JSON dosyasına key eklendi
- [ ] Eksik çeviri bırakılmadı
- [ ] Tarih/sayı formatları dinamik locale kullanıyor
- [ ] `npx tsc --noEmit` → 0 hata

---

## YENİ DİL EKLENİRSE

`src/i18n/languages.ts`'e yeni dil eklendiğinde
bu skill otomatik olarak o dili de kapsayacaktır.
Skill dosyasında değişiklik gerekmez.
