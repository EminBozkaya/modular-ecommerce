// dir field is metadata only — it is NOT applied to <html dir="...">
// Layout stays LTR for all languages; Arabic/Hebrew text flows RTL via Unicode bidi naturally.
export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe',    locale: 'tr-TR', flag: '🇹🇷', dir: 'ltr' as const },
  { code: 'en', label: 'English',   locale: 'en-US', flag: '🇺🇸', dir: 'ltr' as const },
  { code: 'de', label: 'Deutsch',   locale: 'de-DE', flag: '🇩🇪', dir: 'ltr' as const },
  { code: 'fr', label: 'Français',  locale: 'fr-FR', flag: '🇫🇷', dir: 'ltr' as const },
  { code: 'es', label: 'Español',   locale: 'es-ES', flag: '🇪🇸', dir: 'ltr' as const },
  { code: 'ru', label: 'Русский',   locale: 'ru-RU', flag: '🇷🇺', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية',   locale: 'ar-SA', flag: '🇸🇦', dir: 'rtl' as const },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
export type TextDirection = 'ltr' | 'rtl';
