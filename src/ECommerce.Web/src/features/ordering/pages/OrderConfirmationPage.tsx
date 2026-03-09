import { useParams, Link } from 'react-router-dom';
import { useMyOrder } from '../hooks/useMyOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { formatPrice } from '../../../utils/formatters';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
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
                <EmptyState title="Siparis bulunamadi" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Success Header */}
            <div className="text-center mb-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Siparissiniz Alindi!</h1>
                <p className="text-muted-foreground mt-2">
                    Siparis numaraniz: <span className="font-mono font-medium">{order.id}</span>
                </p>
            </div>

            {/* Order Details */}
            <div className="rounded-lg border border-border bg-white p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Siparis Detayi</h2>
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
                            <span>{formatPrice(item.lineTotal, item.currency)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold">
                        <span>Toplam</span>
                        <span>{formatPrice(order.totalAmount, order.currency)}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold mb-2">Teslimat Adresi</h3>
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
                    className="inline-flex items-center justify-center rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                >
                    Alisverise Devam Et
                </Link>
                <Link
                    to="/orders"
                    className="inline-flex items-center justify-center rounded-md bg-[var(--color-ebrar-green)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                >
                    Siparislerim
                </Link>
            </div>
        </div>
    );
}
