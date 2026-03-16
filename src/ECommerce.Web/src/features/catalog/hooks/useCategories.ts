import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/catalogApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useLanguage } from '@/hooks/useLanguage';

export function useCategories(params?: { onlyMain?: boolean }) {
    const { currentLanguage } = useLanguage();
    const baseKey = params?.onlyMain ? [...queryKeys.catalog.categories.all, 'main'] : queryKeys.catalog.categories.all;
    return useQuery({
        queryKey: [...baseKey, currentLanguage],
        queryFn: () => getCategories(params),
    });
}
