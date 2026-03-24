// dir field is metadata only — it is NOT applied to <html dir="...">
// Layout stays LTR for all languages; Arabic/Hebrew text flows RTL via Unicode bidi naturally.
// flagCode: ISO 3166-1 alpha-2 country code used by flag-icons CSS library (fi fi-{flagCode})
export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe',    locale: 'tr-TR', flag: '🇹🇷', flagCode: 'tr', dir: 'ltr' as const },
  { code: 'en', label: 'English',   locale: 'en-US', flag: '🇺🇸', flagCode: 'us', dir: 'ltr' as const },
  { code: 'de', label: 'Deutsch',   locale: 'de-DE', flag: '🇩🇪', flagCode: 'de', dir: 'ltr' as const },
  { code: 'fr', label: 'Français',  locale: 'fr-FR', flag: '🇫🇷', flagCode: 'fr', dir: 'ltr' as const },
  { code: 'es', label: 'Español',   locale: 'es-ES', flag: '🇪🇸', flagCode: 'es', dir: 'ltr' as const },
  { code: 'ru', label: 'Русский',   locale: 'ru-RU', flag: '🇷🇺', flagCode: 'ru', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية',   locale: 'ar-SA', flag: '🇸🇦', flagCode: 'sa', dir: 'rtl' as const },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
export type TextDirection = 'ltr' | 'rtl';
