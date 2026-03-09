import { useNavigate } from 'react-router-dom';
import type { Order } from '../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice } from '../../../utils/formatters';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const navigate = useNavigate();

    const formattedDate = new Date(order.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const truncatedId = order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id;

    return (
        <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="w-full text-left rounded-lg border border-border bg-white p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-muted-foreground">#{truncatedId}</span>
                <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
                <span className="font-semibold">{formatPrice(order.totalAmount, order.currency)}</span>
            </div>
        </button>
    );
}
