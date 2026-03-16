export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', locale: 'tr-TR', flag: '🇹🇷' },
  { code: 'en', label: 'English', locale: 'en-US', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE', flag: '🇩🇪' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
