import { useQuery } from '@tanstack/react-query';
import { getBasket } from '../api/basketApi';
import { queryKeys } from '../../../utils/queryKeys';

export const useBasket = () => {
    return useQuery({
        queryKey: queryKeys.basket.current,
        queryFn: getBasket,
        staleTime: 30 * 1000, // 30 seconds
    });
};
