import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '../types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { className: string }> = {
    Pending: { className: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300' },
    Processing: { className: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
    Paid: { className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
    Shipped: { className: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
    Delivered: { className: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
    Cancelled: { className: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
    Refunded: { className: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
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
