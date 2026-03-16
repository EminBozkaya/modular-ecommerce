import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/catalogApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useLanguage } from '@/hooks/useLanguage';

export function useProduct(id: string) {
    const { currentLanguage } = useLanguage();
    return useQuery({
        queryKey: [...queryKeys.catalog.products.detail(id), currentLanguage],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}
