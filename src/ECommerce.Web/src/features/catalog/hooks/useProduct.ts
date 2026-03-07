import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/catalogApi';
import { queryKeys } from '../../../utils/queryKeys';

export function useProduct(id: string) {
    return useQuery({
        queryKey: queryKeys.catalog.products.detail(id),
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}
