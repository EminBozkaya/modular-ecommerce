import type { Order, OrderStatus } from '../../ordering/types/order';
import type { PaginatedResult } from '../../../types/api';
import { OrderStatusBadge } from '../../ordering/components/OrderStatusBadge';
import { formatPrice } from '../../../utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminOrdersTableProps {
    data: PaginatedResult<Order>;
    onPageChange: (page: number) => void;
    statusFilter: OrderStatus | undefined;
    onStatusFilter: (status: OrderStatus | undefined) => void;
    onRowClick: (order: Order) => void;
}

const statusOptions: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: 'Tümü' },
    { value: 'Pending', label: 'Beklemede' },
    { value: 'Processing', label: 'İşleniyor' },
    { value: 'Paid', label: 'Ödendi' },
    { value: 'Shipped', label: 'Kargoda' },
    { value: 'Delivered', label: 'Teslim Edildi' },
    { value: 'Cancelled', label: 'İptal Edildi' },
    { value: 'Refunded', label: 'İade Edildi' },
];

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function AdminOrdersTable({ data, onPageChange, statusFilter, onStatusFilter, onRowClick }: AdminOrdersTableProps) {
    const totalPages = Math.ceil(data.totalCount / data.pageSize);

    return (
        <div>
            {/* Status Filter */}
            <div className="mb-4">
                <select
                    value={statusFilter ?? ''}
                    onChange={(e) => onStatusFilter(e.target.value ? (e.target.value as OrderStatus) : undefined)}
                    className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] bg-background text-foreground"
                >
                    {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-border">
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Sipariş No</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Müşteri</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tarih</th>
                                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Tutar</th>
                                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Sipariş bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                data.items.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-border hover:bg-accent cursor-pointer transition-colors"
                                        onClick={() => onRowClick(order)}
                                    >
                                        <td className="py-3 px-4 font-mono text-xs text-foreground">
                                            {order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id}
                                        </td>
                                        <td className="py-3 px-4 text-foreground">{order.shippingAddress.fullName}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4 text-right font-medium text-foreground">
                                            {formatPrice(order.totalAmount, order.currency)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                            Toplam {data.totalCount} sipariş
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={data.page <= 1}
                                onClick={() => onPageChange(data.page - 1)}
                                className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-muted-foreground">
                                {data.page} / {totalPages}
                            </span>
                            <button
                                disabled={data.page >= totalPages}
                                onClick={() => onPageChange(data.page + 1)}
                                className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
