import { useParams, Link } from 'react-router-dom';
import { useMyOrder } from '../hooks/useMyOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { formatPrice } from '../../../utils/formatters';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../store/authStore';

export default function OrderDetailPage() {
    const { t, i18n } = useTranslation('orders');
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
                <EmptyState title={t('detail.notFound')} />
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString(
        i18n.language === 'tr' ? 'tr-TR' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {isAuthenticated && (
                <Link
                    to="/orders"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t('detail.backToOrders')}
                </Link>
            )}

            <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{t('detail.orderTitle', { id: order.id.slice(0, 12) })}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Items Table */}
                <div>
                    <h2 className="text-sm font-semibold mb-3">{t('detail.products')}</h2>
                    <div className="border border-border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-white/10">
                                <tr>
                                    <th className="text-left px-4 py-2 font-medium">{t('detail.product')}</th>
                                    <th className="text-center px-4 py-2 font-medium">{t('detail.quantity')}</th>
                                    <th className="text-right px-4 py-2 font-medium">{t('detail.unitPrice')}</th>
                                    <th className="text-right px-4 py-2 font-medium">{t('detail.total')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.productId} className="border-t border-border">
                                        <td className="px-4 py-2">{item.productName}</td>
                                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                                        <td className="px-4 py-2 text-right">{formatPrice(item.unitPrice, order.currency)}</td>
                                        <td className="px-4 py-2 text-right">{formatPrice(item.lineTotal, order.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                    <div className="text-right">
                        <span className="text-sm text-muted-foreground mr-4">{t('detail.grandTotal')}</span>
                        <span className="text-lg font-bold">{formatPrice(order.totalAmount, order.currency)}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t border-border pt-4">
                    <h2 className="text-sm font-semibold mb-2">{t('detail.shippingAddress')}</h2>
                    <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>

                {/* Billing Address */}
                {order.billingAddress && (
                    <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-sm font-semibold">{t('detail.billingAddress')}</h2>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                order.billingAddress.invoiceType === 'individual'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                                {order.billingAddress.invoiceType === 'individual'
                                    ? t('detail.individual')
                                    : t('detail.corporate')}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-0.5">
                            {order.billingAddress.invoiceType === 'individual' ? (
                                <>
                                    <p>{order.billingAddress.fullName}</p>
                                    {order.billingAddress.tcKimlikNo && (
                                        <p>TC: {order.billingAddress.tcKimlikNo.slice(0, 3)}{'*'.repeat(6)}{order.billingAddress.tcKimlikNo.slice(-2)}</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p>{order.billingAddress.companyName}</p>
                                    {order.billingAddress.taxOffice && <p>{order.billingAddress.taxOffice} VD</p>}
                                    {order.billingAddress.taxNumber && <p>VKN: {order.billingAddress.taxNumber}</p>}
                                </>
                            )}
                            <p>{order.billingAddress.addressLine1}</p>
                            {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                            <p>{order.billingAddress.city}, {order.billingAddress.postalCode}</p>
                            <p>{order.billingAddress.country}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
