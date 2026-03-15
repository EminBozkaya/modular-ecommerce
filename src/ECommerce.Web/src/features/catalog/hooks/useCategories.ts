import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/catalogApi';
import { queryKeys } from '../../../utils/queryKeys';

export function useCategories(params?: { onlyMain?: boolean }) {
    return useQuery({
        queryKey: params?.onlyMain ? [...queryKeys.catalog.categories.all, 'main'] : queryKeys.catalog.categories.all,
        queryFn: () => getCategories(params),
        staleTime: Infinity,
    });
}
