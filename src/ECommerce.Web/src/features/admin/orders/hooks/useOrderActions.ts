import { useCallback } from 'react';
import { parseApiError } from '@/api/errorHandling';
import { deleteOrder, restoreOrder } from '../../api/adminApi';
import type { Order } from '../../../ordering/types/order';

export interface OrderModalSettings {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    showConfirm: boolean;
    orderId: string | null;
    actionType: 'delete' | 'restore';
}

export const defaultOrderModalSettings: OrderModalSettings = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    showConfirm: true,
    orderId: null,
    actionType: 'delete',
};

interface UseOrderActionsParams {
    orders: Order[];
    setModalSettings: React.Dispatch<React.SetStateAction<OrderModalSettings>>;
    setSelectedOrder: (order: Order | null) => void;
    setDeleting: (v: boolean) => void;
    fetchData: () => Promise<void>;
}

export function useOrderActions({
    orders,
    setModalSettings,
    setSelectedOrder,
    setDeleting,
    fetchData,
}: UseOrderActionsParams) {
    const handleEdit = useCallback((order: Order) => {
        setSelectedOrder(order);
    }, [setSelectedOrder]);

    const handleDelete = useCallback((id: string) => {
        setModalSettings({
            open: true,
            title: 'Siparisi Sil',
            message: `"${id}" numarali siparisi silmek istediginizden emin misiniz? Bu islem geri alinabilir.`,
            confirmText: 'Sil',
            variant: 'danger',
            showConfirm: true,
            orderId: id,
            actionType: 'delete',
        });
    }, [setModalSettings]);

    const handleRestore = useCallback((id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;
        setModalSettings({
            open: true,
            title: 'Siparisi Geri Yukle',
            message: `"${order.id}" numarali siparisi geri yuklemek istediginizden emin misiniz?`,
            confirmText: 'Geri Yukle',
            variant: 'info',
            showConfirm: true,
            orderId: id,
            actionType: 'restore',
        });
    }, [orders, setModalSettings]);

    const handleConfirmAction = useCallback(async (modalSettings: OrderModalSettings) => {
        const { orderId, actionType } = modalSettings;
        if (!orderId) return;
        setDeleting(true);
        try {
            if (actionType === 'restore') {
                await restoreOrder(orderId);
            } else {
                await deleteOrder(orderId);
            }
            setModalSettings(prev => ({ ...prev, open: false, orderId: null }));
            await fetchData();
        } catch (err: unknown) {
            console.error('Islem sirasinda hata:', err);
            alert(parseApiError(err).message || 'Islem sirasinda bir hata olustu.');
        } finally {
            setDeleting(false);
        }
    }, [setDeleting, setModalSettings, fetchData]);

    const handleModalClose = useCallback(() => {
        setSelectedOrder(null);
        fetchData();
    }, [setSelectedOrder, fetchData]);

    return { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleModalClose };
}
