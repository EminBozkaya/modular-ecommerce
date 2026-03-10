import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../utils/queryKeys';
import { getAllOrders, updateOrderStatus } from '../api/adminApi';
import type { OrderStatus } from '../../ordering/types/order';

export function useAllOrders(params: { page: number; pageSize?: number; status?: OrderStatus }) {
    return useQuery({
        queryKey: queryKeys.admin.orders.list(params),
        queryFn: () => getAllOrders(params),
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard.recentOrders });
        },
    });
}
