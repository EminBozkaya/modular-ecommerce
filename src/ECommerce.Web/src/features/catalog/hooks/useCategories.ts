import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/catalogApi';
import { queryKeys } from '../../../utils/queryKeys';

export function useCategories() {
    return useQuery({
        queryKey: queryKeys.catalog.categories.all,
        queryFn: getCategories,
        staleTime: Infinity,
    });
}
