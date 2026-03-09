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
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]"
                >
                    {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Sipariş No</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Müşteri</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Tarih</th>
                                <th className="text-right py-3 px-4 text-gray-500 font-medium">Tutar</th>
                                <th className="text-center py-3 px-4 text-gray-500 font-medium">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        Sipariş bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                data.items.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => onRowClick(order)}
                                    >
                                        <td className="py-3 px-4 font-mono text-xs text-gray-700">
                                            {order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id}
                                        </td>
                                        <td className="py-3 px-4 text-gray-900">{order.shippingAddress.fullName}</td>
                                        <td className="py-3 px-4 text-gray-600">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4 text-right font-medium text-gray-900">
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
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Toplam {data.totalCount} sipariş
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={data.page <= 1}
                                onClick={() => onPageChange(data.page - 1)}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-600">
                                {data.page} / {totalPages}
                            </span>
                            <button
                                disabled={data.page >= totalPages}
                                onClick={() => onPageChange(data.page + 1)}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
