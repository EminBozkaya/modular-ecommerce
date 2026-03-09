import { useState } from 'react';
import { X } from 'lucide-react';
import type { Order, OrderStatus } from '../../ordering/types/order';
import { OrderStatusBadge } from '../../ordering/components/OrderStatusBadge';
import { useUpdateOrderStatus } from '../hooks/useAdminOrders';

interface OrderStatusUpdateModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'Pending', label: 'Beklemede' },
    { value: 'Processing', label: 'İşleniyor' },
    { value: 'Paid', label: 'Ödendi' },
    { value: 'Shipped', label: 'Kargoya Verildi' },
    { value: 'Delivered', label: 'Teslim Edildi' },
    { value: 'Cancelled', label: 'İptal Edildi' },
    { value: 'Refunded', label: 'İade Edildi' },
];

export function OrderStatusUpdateModal({ order, isOpen, onClose }: OrderStatusUpdateModalProps) {
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const mutation = useUpdateOrderStatus();

    if (!isOpen) return null;

    const hasChanged = newStatus !== order.status;

    const handleConfirm = () => {
        if (!hasChanged) return;
        mutation.mutate(
            { orderId: order.id, newStatus },
            {
                onSuccess: () => {
                    onClose();
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Sipariş Durumunu Güncelle</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Sipariş No</p>
                        <p className="text-sm font-mono text-gray-700">{order.id}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Mevcut Durum</p>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="newStatus" className="block text-sm text-gray-500 mb-1">
                            Yeni Durum
                        </label>
                        <select
                            id="newStatus"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-red-600 mt-2">Durum güncellenirken bir hata oluştu.</p>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        disabled={!hasChanged || mutation.isPending}
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        style={{ background: '#1B5E3F' }}
                    >
                        {mutation.isPending ? 'Güncelleniyor...' : 'Onayla'}
                    </button>
                    <button
                        disabled={mutation.isPending}
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
}
