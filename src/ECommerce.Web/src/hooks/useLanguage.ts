import { useTranslation } from 'react-i18next';

export function useLanguage() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language as 'tr' | 'en' | 'de';

    const changeLanguage = (lang: 'tr' | 'en' | 'de') => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const toggleLanguage = () => {
        changeLanguage(currentLanguage === 'tr' ? 'en' : currentLanguage === 'en' ? 'de' : 'tr');
    };

    const dateLocale = currentLanguage === 'tr' ? 'tr-TR' : currentLanguage === 'de' ? 'de-DE' : 'en-US';

    return { currentLanguage, changeLanguage, toggleLanguage, dateLocale };
}
