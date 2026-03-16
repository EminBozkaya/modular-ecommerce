import { useQuery } from '@tanstack/react-query';
import { getLanguageConfig } from '@/api/configApi';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';
import { queryKeys } from '@/utils/queryKeys';

/**
 * Returns the list of active languages for this deployment,
 * filtered by what the backend config says is supported.
 *
 * - While loading or on error: falls back to all static SUPPORTED_LANGUAGES.
 * - Once resolved: only languages present in both the static list (for metadata)
 *   and the API response (for deployment config) are returned.
 *
 * This enables white-label deployments to show only their configured languages
 * without changing the frontend bundle.
 */
export function useLanguageConfig() {
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.config.languages,
        queryFn: getLanguageConfig,
        staleTime: Infinity, // deployment config never changes at runtime
        gcTime: Infinity,
    });

    const activeLanguages = data
        ? SUPPORTED_LANGUAGES.filter(l => data.supportedLanguages.includes(l.code))
        : SUPPORTED_LANGUAGES;

    // Ensure at least one language is always available
    const languages = activeLanguages.length > 0 ? activeLanguages : SUPPORTED_LANGUAGES;

    return { languages, isLoading };
}
