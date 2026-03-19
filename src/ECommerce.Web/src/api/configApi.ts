import { apiClient } from './client';

export interface LanguageConfig {
    defaultLanguage: string;
    supportedLanguages: string[];
}

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Fetches deployment-level language configuration from the backend. */
export async function getLanguageConfig(): Promise<LanguageConfig> {
    if (isMock) {
        return { defaultLanguage: 'tr', supportedLanguages: ['tr', 'en', 'de', 'fr', 'es', 'ru', 'ar'] };
    }
    const res = await apiClient.get<LanguageConfig>('/api/config/languages');
    return res.data;
}
