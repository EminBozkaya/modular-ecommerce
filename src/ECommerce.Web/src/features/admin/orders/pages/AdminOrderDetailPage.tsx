import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMyOrder } from '../../../ordering/hooks/useMyOrder';
import { OrderStatusBadge } from '../../../ordering/components/OrderStatusBadge';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import { formatPrice } from '../../../../utils/formatters';
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner';

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminOrderDetailPage() {
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
                <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Siparişlere Dön
                </button>
                <p className="text-red-600">Sipariş bulunamadı.</p>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
            >
                <ArrowLeft className="h-4 w-4" /> Siparişlere Dön
            </button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Sipariş Detayı</h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">{order.id}</p>
                </div>
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95"
                    style={{ background: '#1B5E3F' }}
                >
                    Durumu Güncelle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <OrderStatusBadge status={order.status} />
                        <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Ürünler</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-2 text-gray-500 font-medium">Ürün</th>
                                    <th className="text-right py-2 px-2 text-gray-500 font-medium">Birim Fiyat</th>
                                    <th className="text-center py-2 px-2 text-gray-500 font-medium">Adet</th>
                                    <th className="text-right py-2 px-2 text-gray-500 font-medium">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.productId} className="border-b border-gray-50">
                                        <td className="py-2.5 px-2 text-gray-900">{item.productName}</td>
                                        <td className="py-2.5 px-2 text-right text-gray-600">{formatPrice(item.unitPrice, item.currency)}</td>
                                        <td className="py-2.5 px-2 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-2.5 px-2 text-right font-medium text-gray-900">{formatPrice(item.lineTotal, item.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-200">
                                    <td colSpan={3} className="py-3 px-2 text-right font-semibold text-gray-900">Genel Toplam</td>
                                    <td className="py-3 px-2 text-right font-bold text-lg" style={{ color: '#1B5E3F' }}>
                                        {formatPrice(order.totalAmount, order.currency)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Teslimat Adresi</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
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
