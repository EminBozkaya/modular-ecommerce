import { useParams, Link } from 'react-router-dom';
import { useMyOrder } from '../hooks/useMyOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { formatPrice } from '../../../utils/formatters';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OrderConfirmationPage() {
    const { t } = useTranslation('orders');
    const { id } = useParams<{ id: string }>();
    const { data: order, isLoading, error, refetch } = useMyOrder(id || '');

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={error.message} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState title={t('confirmation.notFound')} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Success Header */}
            <div className="text-center mb-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground">{t('confirmation.success')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('confirmation.orderNumber')} <span className="font-mono font-medium">{order.id}</span>
                </p>
            </div>

            {/* Order Details */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t('confirmation.detailTitle')}</h2>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                            <div>
                                <span className="font-medium">{item.productName}</span>
                                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                            </div>
                            <span>{formatPrice(item.lineTotal, order.currency)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold">
                        <span>{t('confirmation.total')}</span>
                        <span>{formatPrice(order.totalAmount, order.currency)}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold mb-2">{t('confirmation.shippingAddress')}</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3.5 text-sm font-bold text-foreground hover:bg-accent transition-all active:scale-95"
                >
                    {t('confirmation.continueShopping')}
                </Link>
                <Link
                    to="/orders"
                    className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand-primary)] px-6 py-3.5 text-sm font-bold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-lg shadow-black/5 active:scale-95"
                >
                    {t('confirmation.myOrders')}
                </Link>
            </div>
        </div>
    );
}
