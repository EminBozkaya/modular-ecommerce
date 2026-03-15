import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../api/catalogApi';
import type { ProductListParams } from '../types/product';
import { queryKeys } from '../../../utils/queryKeys';

export function useInfiniteProducts(params: Omit<ProductListParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: queryKeys.catalog.products.list(params),
        queryFn: ({ pageParam = 1 }) => 
            getProducts({ ...params, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const currentTotal = lastPage.page * lastPage.pageSize;
            return currentTotal < lastPage.totalCount ? lastPage.page + 1 : undefined;
        },
    });
}
