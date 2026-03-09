import { useParams, Link } from 'react-router-dom';
import { useMyOrder } from '../hooks/useMyOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { formatPrice } from '../../../utils/formatters';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
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

    const formattedDate = new Date(order.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Link
                to="/orders"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Siparislerime Don
            </Link>

            <div className="rounded-lg border border-border bg-white p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Siparis #{order.id.slice(0, 12)}...</h1>
                        <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Items Table */}
                <div>
                    <h2 className="text-sm font-semibold mb-3">Urunler</h2>
                    <div className="border border-border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-2 font-medium">Urun</th>
                                    <th className="text-center px-4 py-2 font-medium">Adet</th>
                                    <th className="text-right px-4 py-2 font-medium">Birim Fiyat</th>
                                    <th className="text-right px-4 py-2 font-medium">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.productId} className="border-t border-border">
                                        <td className="px-4 py-2">{item.productName}</td>
                                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                                        <td className="px-4 py-2 text-right">{formatPrice(item.unitPrice, item.currency)}</td>
                                        <td className="px-4 py-2 text-right">{formatPrice(item.lineTotal, item.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                    <div className="text-right">
                        <span className="text-sm text-muted-foreground mr-4">Genel Toplam</span>
                        <span className="text-lg font-bold">{formatPrice(order.totalAmount, order.currency)}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t border-border pt-4">
                    <h2 className="text-sm font-semibold mb-2">Teslimat Adresi</h2>
                    <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
