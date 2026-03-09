import { useQuery } from '@tanstack/react-query';
import { getMyOrderById } from '../api/orderingApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useAuthStore } from '../../../store/authStore';

export function useMyOrder(id: string) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: () => getMyOrderById(id),
        enabled: !!id && isAuthenticated,
    });
}
