import { useQuery } from '@tanstack/react-query';
import { getBasket } from '../api/basketApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useLanguage } from '@/hooks/useLanguage';

export const useBasket = () => {
    const { currentLanguage } = useLanguage();
    return useQuery({
        // Include language so basket re-fetches when language changes (unit name translations)
        queryKey: [...queryKeys.basket.current, currentLanguage],
        queryFn: getBasket,
        staleTime: 30 * 1000,
    });
};
