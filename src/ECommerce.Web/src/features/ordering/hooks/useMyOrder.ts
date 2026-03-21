import { useQuery } from '@tanstack/react-query';
import { getMyOrderById } from '../api/orderingApi';
import { queryKeys } from '../../../utils/queryKeys';

export function useMyOrder(id: string) {
    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: () => getMyOrderById(id),
        enabled: !!id,
    });
}
