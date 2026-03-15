import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '../types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { className: string }> = {
    Pending: { className: 'bg-gray-100 text-gray-700' },
    Processing: { className: 'bg-yellow-100 text-yellow-700' },
    Paid: { className: 'bg-blue-100 text-blue-700' },
    Shipped: { className: 'bg-purple-100 text-purple-700' },
    Delivered: { className: 'bg-green-100 text-green-700' },
    Cancelled: { className: 'bg-red-100 text-red-700' },
    Refunded: { className: 'bg-orange-100 text-orange-700' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const { t } = useTranslation('orders');
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
            {t(`status.${status}`)}
        </span>
    );
}
