import { useTranslation } from 'react-i18next';
import { getAgGridLocale, getDateConfig, type AgGridLocaleText, type AgGridDateConfig } from '@/utils/agGridLocales';

export function useAgGridLocale(): { localeText: AgGridLocaleText; dateConfig: AgGridDateConfig } {
    const { i18n } = useTranslation();
    const lang = i18n.language?.split('-')[0] ?? 'tr';
    return {
        localeText: getAgGridLocale(lang),
        dateConfig: getDateConfig(lang),
    };
}
