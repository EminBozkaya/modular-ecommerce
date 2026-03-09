import { useState } from 'react';
import type { Order, OrderStatus } from '../../../ordering/types/order';
import { useAllOrders } from '../../hooks/useAdminOrders';
import { AdminOrdersTable } from '../../components/AdminOrdersTable';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner';

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data, isLoading, isError } = useAllOrders({ page, pageSize: 10, status: statusFilter });

    const handleStatusFilterChange = (status: OrderStatus | undefined) => {
        setStatusFilter(status);
        setPage(1);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6" style={{ color: '#1B5E3F' }}>Siparişler</h1>

            {isLoading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : isError ? (
                <p className="text-red-600">Siparişler yüklenirken bir hata oluştu.</p>
            ) : data ? (
                <AdminOrdersTable
                    data={data}
                    onPageChange={setPage}
                    statusFilter={statusFilter}
                    onStatusFilter={handleStatusFilterChange}
                    onRowClick={setSelectedOrder}
                />
            ) : null}

            {selectedOrder && (
                <OrderStatusUpdateModal
                    order={selectedOrder}
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
