import type { OrderStatus } from '../types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    Pending: { label: 'Beklemede', className: 'bg-gray-100 text-gray-700' },
    PaymentProcessing: { label: 'Odeme Isleniyor', className: 'bg-yellow-100 text-yellow-700' },
    Confirmed: { label: 'Onaylandi', className: 'bg-blue-100 text-blue-700' },
    Shipped: { label: 'Kargoya Verildi', className: 'bg-purple-100 text-purple-700' },
    Delivered: { label: 'Teslim Edildi', className: 'bg-green-100 text-green-700' },
    Cancelled: { label: 'Iptal Edildi', className: 'bg-red-100 text-red-700' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
}
