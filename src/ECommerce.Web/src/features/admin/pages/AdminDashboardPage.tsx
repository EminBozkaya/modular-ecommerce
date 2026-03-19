import { useState } from 'react';
import { ShoppingCart, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardSummary, useRevenueData, useRecentOrders, useLowStockProducts } from '../hooks/useDashboard';
import { SummaryCard } from '../components/SummaryCard';
import { RevenueChart } from '../components/RevenueChart';
import { LowStockTable } from '../components/LowStockTable';
import { OrderStatusBadge } from '../../ordering/components/OrderStatusBadge';
import { formatPrice } from '../../../utils/formatters';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';
import type { DashboardPeriod } from '../types/dashboard';

export default function AdminDashboardPage() {
    const { t, i18n } = useTranslation('admin');
    const [period, setPeriod] = useState<DashboardPeriod>('monthly');
    const summary = useDashboardSummary(period);
    const revenue = useRevenueData();
    const recentOrders = useRecentOrders();
    const lowStock = useLowStockProducts();
    const navigate = useNavigate();

    const currentLocale = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.locale ?? 'tr-TR';

    const periodOptions: { value: DashboardPeriod; label: string }[] = [
        { value: 'daily', label: t('dashboard.periods.daily') },
        { value: 'weekly', label: t('dashboard.periods.weekly') },
        { value: 'monthly', label: t('dashboard.periods.monthly') },
        { value: 'yearly', label: t('dashboard.periods.yearly') },
    ];

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(currentLocale, { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                    {t('dashboard.title')}
                </h1>

                {/* Period Selector */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-accent rounded-xl w-full sm:w-fit sm:flex sm:items-center border border-border shadow-inner">
                    {periodOptions.map((opt) => {
                        const isActive = period === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setPeriod(opt.value)}
                                className={`
                                    relative px-3 sm:px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 w-full sm:w-auto
                                    ${isActive
                                        ? 'bg-background text-[var(--brand-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}
                                `}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary Cards */}
            <section className="mb-8">
                {summary.isLoading ? (
                    <div className="flex justify-center py-8"><LoadingSpinner /></div>
                ) : summary.isError ? (
                    <p className="text-red-600 text-sm">{t('dashboard.summaryError')}</p>
                ) : summary.data ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title={t('dashboard.cards.totalOrders')}
                            value={summary.data.totalOrders}
                            icon={<ShoppingCart className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title={t('dashboard.cards.totalRevenue')}
                            value={formatPrice(summary.data.totalRevenue, summary.data.revenueCurrency)}
                            icon={<TrendingUp className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title={t('dashboard.cards.totalCustomers')}
                            value={summary.data.totalCustomers}
                            icon={<Users className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title={t('dashboard.cards.lowStock')}
                            value={summary.data.lowStockCount}
                            icon={<AlertTriangle className="h-6 w-6" />}
                            description={t('dashboard.cards.lowStockDesc')}
                        />
                    </div>
                ) : null}
            </section>

            {/* Revenue Chart */}
            <section className="mb-8">
                {revenue.isLoading ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : revenue.isError ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <p className="text-red-600 text-sm">{t('dashboard.revenueError')}</p>
                    </div>
                ) : revenue.data ? (
                    <RevenueChart data={revenue.data} />
                ) : null}
            </section>

            {/* Recent Orders + Low Stock */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                    <h3 className="text-base font-semibold text-foreground mb-4">{t('dashboard.recentOrders')}</h3>
                    {recentOrders.isLoading ? (
                        <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : recentOrders.isError ? (
                        <p className="text-red-600 text-sm">{t('dashboard.recentOrdersError')}</p>
                    ) : recentOrders.data && recentOrders.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t('dashboard.table.customer')}</th>
                                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t('dashboard.table.date')}</th>
                                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">{t('dashboard.table.amount')}</th>
                                        <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('dashboard.table.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-border hover:bg-accent cursor-pointer transition-colors"
                                            onClick={() => {
                                                if (!window.getSelection()?.toString()) {
                                                    navigate(`/admin/orders/${order.id}`);
                                                }
                                            }}
                                        >
                                            <td className="py-2 px-2 text-foreground">{order.shippingAddress.fullName}</td>
                                            <td className="py-2 px-2 text-muted-foreground">{formatDate(order.createdAt)}</td>
                                            <td className="py-2 px-2 text-right font-medium">{formatPrice(order.totalAmount, order.currency)}</td>
                                            <td className="py-2 px-2 text-center"><OrderStatusBadge status={order.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('dashboard.noOrders')}</p>
                    )}
                </div>

                {/* Low Stock */}
                {lowStock.isLoading ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : lowStock.isError ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <p className="text-red-600 text-sm">{t('dashboard.lowStockError')}</p>
                    </div>
                ) : lowStock.data ? (
                    <LowStockTable products={lowStock.data} />
                ) : null}
            </section>
        </div>
    );
}
