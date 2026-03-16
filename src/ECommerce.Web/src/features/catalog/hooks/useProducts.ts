import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/catalogApi';
import type { ProductListParams } from '../types/product';
import { queryKeys } from '../../../utils/queryKeys';
import { useLanguage } from '@/hooks/useLanguage';

export function useProducts(params: ProductListParams) {
    const { currentLanguage } = useLanguage();
    return useQuery({
        queryKey: queryKeys.catalog.products.list({ ...params, lang: currentLanguage }),
        queryFn: () => getProducts(params),
    });
}
