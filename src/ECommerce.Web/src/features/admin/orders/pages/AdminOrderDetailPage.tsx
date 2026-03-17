import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMyOrder } from '../../../ordering/hooks/useMyOrder';
import { OrderStatusBadge } from '../../../ordering/components/OrderStatusBadge';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import { formatPrice } from '../../../../utils/formatters';
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function AdminOrderDetailPage() {
    const { t, i18n } = useTranslation(['admin', 'orders']);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading, isError } = useMyOrder(id ?? '');
    const [showStatusModal, setShowStatusModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        );
    }

    if (isError || !order) {
        return (
            <div>
                <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="h-4 w-4" /> {t('orders:detail.backToOrders')}
                </button>
                <p className="text-red-600">{t('orders:detail.notFound')}</p>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
            >
                <ArrowLeft className="h-4 w-4" /> {t('orders:detail.backToOrders')}
            </button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{t('orders:detail.detailTitle')}</h1>
                    <p className="text-sm text-muted-foreground font-mono mt-1">{order.id}</p>
                </div>
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95"
                    style={{ background: 'var(--brand-primary)' }}
                >
                    {t('admin:orders.mobile.updateStatus')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <OrderStatusBadge status={order.status} />
                        <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground mb-3">{t('orders:detail.products')}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t('orders:detail.product')}</th>
                                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">{t('orders:detail.unitPrice')}</th>
                                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('orders:detail.quantity')}</th>
                                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">{t('orders:detail.total')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.productId} className="border-b border-border/50">
                                        <td className="py-2.5 px-2 text-foreground">{item.productName}</td>
                                        <td className="py-2.5 px-2 text-right text-muted-foreground">{formatPrice(item.unitPrice, order.currency)}</td>
                                        <td className="py-2.5 px-2 text-center text-muted-foreground">{item.quantity}</td>
                                        <td className="py-2.5 px-2 text-right font-medium text-foreground">{formatPrice(item.lineTotal, order.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-border">
                                    <td colSpan={3} className="py-3 px-2 text-right font-semibold text-foreground">{t('orders:detail.grandTotal')}</td>
                                    <td className="py-3 px-2 text-right font-bold text-lg" style={{ color: 'var(--brand-primary)' }}>
                                        {formatPrice(order.totalAmount, order.currency)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t('orders:detail.shippingAddress')}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {showStatusModal && (
                <OrderStatusUpdateModal
                    order={order}
                    isOpen={showStatusModal}
                    onClose={() => setShowStatusModal(false)}
                />
            )}
        </div>
    );
}
