export type DashboardPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DashboardSummary {
    totalOrders: number;
    totalRevenue: number;
    revenueCurrency: string;
    totalCustomers: number;
    lowStockCount: number;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
}
