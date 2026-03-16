import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/languages';

export function useLanguage() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language as LanguageCode;

    const changeLanguage = (lang: LanguageCode) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const toggleLanguage = () => {
        const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
        const idx = codes.indexOf(currentLanguage);
        changeLanguage(codes[(idx + 1) % codes.length]);
    };

    const dateLocale =
        SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.locale ??
        SUPPORTED_LANGUAGES[0].locale;

    return { currentLanguage, changeLanguage, toggleLanguage, dateLocale };
}
