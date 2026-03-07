import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/catalogApi';
import type { ProductListParams } from '../types/product';
import { queryKeys } from '../../../utils/queryKeys';

export function useProducts(params: ProductListParams) {
    return useQuery({
        queryKey: queryKeys.catalog.products.list(params),
        queryFn: () => getProducts(params),
    });
}
