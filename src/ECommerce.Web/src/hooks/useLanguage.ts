import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/languages';

function applyDirectionToDocument(langCode: string) {
    document.documentElement.lang = langCode;
    // dir is intentionally NOT set on <html> — layout stays LTR for all languages.
    // Arabic text flows RTL naturally via Unicode bidi algorithm without mirroring the UI.
}

export function useLanguage() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language as LanguageCode;

    // Apply dir/lang on mount (handles page reload)
    useEffect(() => {
        applyDirectionToDocument(currentLanguage);
    }, [currentLanguage]);

    const changeLanguage = (lang: LanguageCode) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        applyDirectionToDocument(lang);
    };

    const toggleLanguage = () => {
        const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
        const idx = codes.indexOf(currentLanguage);
        changeLanguage(codes[(idx + 1) % codes.length]);
    };

    const dateLocale =
        SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.locale ??
        SUPPORTED_LANGUAGES[0].locale;

    const isRTL =
        (SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.dir ?? 'ltr') === 'rtl';

    return { currentLanguage, changeLanguage, toggleLanguage, dateLocale, isRTL };
}
