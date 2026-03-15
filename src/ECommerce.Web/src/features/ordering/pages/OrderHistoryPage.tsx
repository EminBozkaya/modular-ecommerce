import { useMyOrders } from '../hooks/useMyOrders';
import { OrderCard } from '../components/OrderCard';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useTranslation } from 'react-i18next';

export default function OrderHistoryPage() {
    const { t } = useTranslation('orders');
    const { data: orders, isLoading, error, refetch } = useMyOrders();

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

    if (!orders || orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title={t('history.empty')}
                    description={t('history.emptyDesc')}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">{t('history.title')}</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
