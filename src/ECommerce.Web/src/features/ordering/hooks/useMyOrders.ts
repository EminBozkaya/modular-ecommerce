import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../api/orderingApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useAuthStore } from '../../../store/authStore';

export function useMyOrders() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery({
        queryKey: queryKeys.orders.all,
        queryFn: getMyOrders,
        enabled: isAuthenticated,
    });
}
