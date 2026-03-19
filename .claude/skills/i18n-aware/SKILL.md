# i18n-Aware Development Skill

## Açıklama
Bu skill, yeni UI bileşeni, sayfa, modal veya form oluşturulurken
ya da mevcut bileşenlere metin eklenirken otomatik tetiklenir.
Projedeki çok dilli destek altyapısıyla tam uyumlu kod üretilmesini sağlar.

**7 aktif dil:** tr · en · de · fr · es · ru · ar

## Tetiklenme Koşulları
- Yeni component, sayfa, modal veya form oluşturulurken
- Mevcut bileşene yeni UI metni eklenirken
- "component ekle", "sayfa ekle", "modal", "form", "yeni özellik"
- "add component", "add page", "new feature", "neue Komponente"
- Mevcut hardcode stringleri i18n'e çevirirken

---

## ADIM 1 — Desteklenen Dilleri Oku

**Her zaman ilk adım:** `src/i18n/languages.ts` dosyasını oku.
Bu dosya projenin tek dil kaynağıdır — hangi dillerin aktif olduğu buradan belirlenir.

```ts
// Mevcut yapı (değişmiş olabilir — her zaman dosyadan oku):
export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe',   locale: 'tr-TR', flag: '🇹🇷' },
  { code: 'en', label: 'English',  locale: 'en-US', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch',  locale: 'de-DE', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', locale: 'fr-FR', flag: '🇫🇷' },
  { code: 'es', label: 'Español',  locale: 'es-ES', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский',  locale: 'ru-RU', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية',  locale: 'ar-SA', flag: '🇸🇦' },
] as const;
```

Dosyayı okumadan önce varsayım yapma — dil listesi değişmiş olabilir.

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

### 3a — Hangi key'ler mevcut?

İlgili namespace JSON'larını **okuyarak** mevcut key'leri belirle.
Önce `tr/<namespace>.json`'ı oku, sonra diğer dilleri.

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

### 3b — Key varsa: sadece bileşeni güncelle

Eğer key zaten JSON'da mevcutsa JSON dosyasına dokunma.
Sadece bileşende `t('mevcut.key')` çağrısını ekle.

### 3c — Key yoksa: tüm 7 dile ekle

**Kural: Bir dil için eklenen key, diğer tüm dillere de eklenmeli.**
Eksik key bırakma — fallback'e düşer, kullanıcı ham key görür.

```json
// tr/admin.json
"newFeature": {
  "title": "Yeni Özellik",
  "save": "Kaydet",
  "placeholder": "Değer girin..."
}

// en/admin.json
"newFeature": {
  "title": "New Feature",
  "save": "Save",
  "placeholder": "Enter value..."
}

// de/admin.json
"newFeature": {
  "title": "Neue Funktion",
  "save": "Speichern",
  "placeholder": "Wert eingeben..."
}

// fr/admin.json
"newFeature": {
  "title": "Nouvelle fonctionnalité",
  "save": "Enregistrer",
  "placeholder": "Entrer une valeur..."
}

// es/admin.json
"newFeature": {
  "title": "Nueva función",
  "save": "Guardar",
  "placeholder": "Ingrese un valor..."
}

// ru/admin.json
"newFeature": {
  "title": "Новая функция",
  "save": "Сохранить",
  "placeholder": "Введите значение..."
}

// ar/admin.json
"newFeature": {
  "title": "ميزة جديدة",
  "save": "حفظ",
  "placeholder": "أدخل قيمة..."
}
```

**Arapça için gerçek Arapça metin yaz. Rusça için gerçek Kiril yaz.**
Copy-paste yapma, her dilin doğal karşılığını kullan.

---

## ADIM 4 — Bileşende Kullanım

```tsx
import { useTranslation } from 'react-i18next';

// Tek namespace:
const { t } = useTranslation('admin');

// Birden fazla namespace:
const { t } = useTranslation(['admin', 'common']);

// Kullanım:
<h2>{t('newFeature.title')}</h2>
<button>{t('newFeature.save')}</button>
<input placeholder={t('newFeature.placeholder')} />

// Farklı namespace belirtmek için:
<span>{t('buttons.cancel', { ns: 'common' })}</span>

// Parametre ile:
<p>{t('common.totalRecords', { ns: 'admin', count: 42 })}</p>
```

### Hook içinde default prop pattern'i

Default prop value'lar hook kullanamaz. Şu pattern'i kullan:

```tsx
// ❌ YANLIŞ — hook default param'da çalışmaz
function Modal({ title = t('modal.defaultTitle') }) { ... }

// ✅ DOĞRU — içeride resolve et
function Modal({ title }: { title?: string }) {
  const { t } = useTranslation('admin');
  const resolvedTitle = title ?? t('modal.defaultTitle');
  return <h2>{resolvedTitle}</h2>;
}
```

### Module-level array pattern'i

Module seviyesinde tanımlanan array'ler hook kullanamaz:

```tsx
// ❌ YANLIŞ — module scope'da hook kullanılamaz
const options = [{ label: 'Aktif' }, { label: 'Pasif' }];

// ✅ DOĞRU — component içine taşı
function MyFilter() {
  const { t } = useTranslation('admin');
  const options = [
    { label: t('filter.active') },
    { label: t('filter.passive') },
  ];
  ...
}
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
date.toLocaleDateString(currentLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })

// Para birimi:
amount.toLocaleString(currentLocale, { style: 'currency', currency: 'TRY' })
```

---

## MEVCUT HARDCODE STRİNGLERİ DÜZELTME

Mevcut bir bileşende hardcode string bulursan:

1. İlgili namespace JSON dosyasını oku — key zaten var mı kontrol et
2. Key varsa: sadece `t()` ile sar
3. Key yoksa: tüm 7 dil JSON'una ekle, sonra `t()` ile sar
4. TypeScript `npx tsc --noEmit` ile doğrula

---

## YASAK KULLANIM

```tsx
// ❌ YANLIŞ — hardcode string
<button>Kaydet</button>
<p>Ürün bulunamadı</p>
<h1>Siparişlerim</h1>
date.toLocaleDateString('tr-TR')

// ✅ DOĞRU
<button>{t('buttons.save', { ns: 'common' })}</button>
<p>{t('catalog.list.empty')}</p>
<h1>{t('orders.history.title')}</h1>
date.toLocaleDateString(currentLocale)
```

---

## KONTROL LİSTESİ

Bileşen tamamlanmadan önce:

- [ ] `src/i18n/languages.ts` okundu, aktif diller belirlendi
- [ ] Tüm görünen metinler `t()` ile sarıldı
- [ ] Her dil için JSON dosyasına key eklendi (eksik key yok)
- [ ] Module-level array'ler component içine taşındı (gerekiyorsa)
- [ ] Default prop'lar için içeride resolve pattern'i kullanıldı (gerekiyorsa)
- [ ] Tarih/sayı formatları dinamik locale kullanıyor
- [ ] `npx tsc --noEmit` → 0 hata

---

## YENİ DİL EKLENİRSE

`src/i18n/languages.ts`'e yeni dil eklendiğinde
bu skill otomatik olarak o dili de kapsayacaktır.
Skill dosyasında değişiklik gerekmez.
