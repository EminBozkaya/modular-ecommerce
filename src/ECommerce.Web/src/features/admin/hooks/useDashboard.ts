import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../utils/queryKeys';
import { getDashboardSummary, getRevenueData, getRecentOrders, getLowStockProducts } from '../api/adminApi';
import type { DashboardPeriod } from '../types/dashboard';

export function useDashboardSummary(period: DashboardPeriod) {
    return useQuery({
        queryKey: queryKeys.admin.dashboard.summary(period),
        queryFn: () => getDashboardSummary(period),
        staleTime: 60_000,
    });
}

export function useRevenueData() {
    return useQuery({
        queryKey: queryKeys.admin.dashboard.revenueData,
        queryFn: getRevenueData,
        staleTime: 60_000,
    });
}

export function useRecentOrders() {
    return useQuery({
        queryKey: queryKeys.admin.dashboard.recentOrders,
        queryFn: getRecentOrders,
    });
}

export function useLowStockProducts() {
    return useQuery({
        queryKey: queryKeys.admin.dashboard.lowStock,
        queryFn: getLowStockProducts,
    });
}
