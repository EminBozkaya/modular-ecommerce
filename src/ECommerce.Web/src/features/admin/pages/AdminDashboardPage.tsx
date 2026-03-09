import { useState } from 'react';
import { ShoppingCart, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useDashboardSummary, useRevenueData, useRecentOrders, useLowStockProducts } from '../hooks/useDashboard';
import { SummaryCard } from '../components/SummaryCard';
import { RevenueChart } from '../components/RevenueChart';
import { LowStockTable } from '../components/LowStockTable';
import { OrderStatusBadge } from '../../ordering/components/OrderStatusBadge';
import { formatPrice } from '../../../utils/formatters';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import type { DashboardPeriod } from '../types/dashboard';

const periodOptions: { value: DashboardPeriod; label: string }[] = [
    { value: 'daily', label: 'Günlük' },
    { value: 'weekly', label: 'Haftalık' },
    { value: 'monthly', label: 'Aylık' },
    { value: 'yearly', label: 'Yıllık' },
];

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<DashboardPeriod>('monthly');
    const summary = useDashboardSummary(period);
    const revenue = useRevenueData();
    const recentOrders = useRecentOrders();
    const lowStock = useLowStockProducts();
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Kontrol Paneli</h1>

                {/* Period Selector */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {periodOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setPeriod(opt.value)}
                            className="px-3 py-1.5 text-sm font-medium transition-all"
                            style={{
                                background: period === opt.value ? '#1B5E3F' : 'white',
                                color: period === opt.value ? 'white' : '#6b7280',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <section className="mb-8">
                {summary.isLoading ? (
                    <div className="flex justify-center py-8"><LoadingSpinner /></div>
                ) : summary.isError ? (
                    <p className="text-red-600 text-sm">Özet veriler yüklenemedi.</p>
                ) : summary.data ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Toplam Sipariş"
                            value={summary.data.totalOrders}
                            icon={<ShoppingCart className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title="Toplam Gelir"
                            value={formatPrice(summary.data.totalRevenue, summary.data.revenueCurrency)}
                            icon={<TrendingUp className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title="Toplam Müşteri"
                            value={summary.data.totalCustomers}
                            icon={<Users className="h-6 w-6" />}
                        />
                        <SummaryCard
                            title="Düşük Stok"
                            value={summary.data.lowStockCount}
                            icon={<AlertTriangle className="h-6 w-6" />}
                            description="5 ve altı stoklu ürünler"
                        />
                    </div>
                ) : null}
            </section>

            {/* Revenue Chart */}
            <section className="mb-8">
                {revenue.isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : revenue.isError ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <p className="text-red-600 text-sm">Gelir grafiği yüklenemedi.</p>
                    </div>
                ) : revenue.data ? (
                    <RevenueChart data={revenue.data} />
                ) : null}
            </section>

            {/* Recent Orders + Low Stock */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Son Siparişler</h3>
                    {recentOrders.isLoading ? (
                        <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : recentOrders.isError ? (
                        <p className="text-red-600 text-sm">Son siparişler yüklenemedi.</p>
                    ) : recentOrders.data && recentOrders.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-2 px-2 text-gray-500 font-medium">Müşteri</th>
                                        <th className="text-left py-2 px-2 text-gray-500 font-medium">Tarih</th>
                                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Tutar</th>
                                        <th className="text-center py-2 px-2 text-gray-500 font-medium">Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        >
                                            <td className="py-2 px-2 text-gray-900">{order.shippingAddress.fullName}</td>
                                            <td className="py-2 px-2 text-gray-600">{formatDate(order.createdAt)}</td>
                                            <td className="py-2 px-2 text-right font-medium">{formatPrice(order.totalAmount, order.currency)}</td>
                                            <td className="py-2 px-2 text-center"><OrderStatusBadge status={order.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Henüz sipariş bulunmuyor.</p>
                    )}
                </div>

                {/* Low Stock */}
                {lowStock.isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : lowStock.isError ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <p className="text-red-600 text-sm">Düşük stok verileri yüklenemedi.</p>
                    </div>
                ) : lowStock.data ? (
                    <LowStockTable products={lowStock.data} />
                ) : null}
            </section>
        </div>
    );
}
