import { useState } from 'react';
import { X } from 'lucide-react';
import type { Order, OrderStatus } from '../../ordering/types/order';
import { OrderStatusBadge } from '../../ordering/components/OrderStatusBadge';
import { useUpdateOrderStatus } from '../hooks/useAdminOrders';
import { useTranslation } from 'react-i18next';

interface OrderStatusUpdateModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
}

const statusValues: OrderStatus[] = [
    'Pending',
    'Processing',
    'Paid',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded',
];

export function OrderStatusUpdateModal({ order, isOpen, onClose }: OrderStatusUpdateModalProps) {
    const { t } = useTranslation('admin');
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
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-foreground">{t('modals.orderStatus.title')}</h3>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">{t('modals.orderStatus.orderNo')}</p>
                        <p className="text-sm font-mono text-foreground">{order.id}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">{t('modals.orderStatus.currentStatus')}</p>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="newStatus" className="block text-sm text-muted-foreground mb-1">
                            {t('modals.orderStatus.newStatus')}
                        </label>
                        <select
                            id="newStatus"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                        >
                            {statusValues.map((val) => (
                                <option key={val} value={val}>{t(`status.${val}`)}</option>
                            ))}
                        </select>
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-red-600 mt-2">{t('modals.orderStatus.error')}</p>
                    )}
                </div>

                <div className="bg-accent px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        disabled={!hasChanged || mutation.isPending}
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        style={{ background: 'var(--brand-primary)' }}
                    >
                        {mutation.isPending ? t('buttons.updating') : t('modals.orderStatus.confirm')}
                    </button>
                    <button
                        disabled={mutation.isPending}
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-accent transition-all active:scale-95"
                    >
                        {t('modals.orderStatus.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}
