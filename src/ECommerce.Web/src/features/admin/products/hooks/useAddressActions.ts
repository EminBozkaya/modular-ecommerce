import { useCallback } from 'react';
import { createAddress, updateAddress, deleteAddress, restoreAddress } from '../../api/adminApi';
import type { AdminAddress } from '../../api/adminApi';
import type { AddressFormData } from '@/lib/validations/admin.schema';
import { parseApiError } from '@/api/errorHandling';

export interface AddressModalSettings {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    showConfirm: boolean;
    addressId: string | null;
    actionType: 'delete' | 'restore';
}

export const defaultAddressModalSettings: AddressModalSettings = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    showConfirm: true,
    addressId: null,
    actionType: 'delete',
};

interface UseAddressActionsParams {
    addresses: AdminAddress[];
    setModalSettings: React.Dispatch<React.SetStateAction<AddressModalSettings>>;
    setModalOpen: (open: boolean) => void;
    setEditingAddress: (address: AdminAddress | null) => void;
    setDeleting: (v: boolean) => void;
    setSaving: (v: boolean) => void;
    fetchData: () => Promise<void>;
}

export function useAddressActions({
    setModalSettings,
    setModalOpen,
    setEditingAddress,
    setDeleting,
    setSaving,
    fetchData,
}: UseAddressActionsParams) {
    
    const handleEdit = useCallback((address: AdminAddress) => {
        setEditingAddress(address);
        setModalOpen(true);
    }, [setEditingAddress, setModalOpen]);

    const handleDelete = useCallback((id: string) => {
        setModalSettings({
            open: true,
            title: 'Adresi Sil',
            message: 'Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.',
            confirmText: 'Sil',
            variant: 'danger',
            showConfirm: true,
            addressId: id,
            actionType: 'delete',
        });
    }, [setModalSettings]);

    const handleRestore = useCallback((id: string) => {
        setModalSettings({
            open: true,
            title: 'Adresi Geri Yükle',
            message: 'Bu adresi geri yüklemek istediğinizden emin misiniz?',
            confirmText: 'Geri Yükle',
            variant: 'info',
            showConfirm: true,
            addressId: id,
            actionType: 'restore',
        });
    }, [setModalSettings]);

    const handleConfirmAction = useCallback(async (settings: AddressModalSettings) => {
        const { addressId, actionType } = settings;
        if (!addressId) return;

        setDeleting(true);
        try {
            if (actionType === 'restore') {
                await restoreAddress(addressId);
            } else {
                await deleteAddress(addressId);
            }
            setModalSettings(prev => ({ ...prev, open: false, addressId: null }));
            await fetchData();
        } catch (err: unknown) {
            console.error('Adres işlemi hatası:', err);
            alert(parseApiError(err).message || 'Hata oluştu.');
        } finally {
            setDeleting(false);
        }
    }, [setDeleting, setModalSettings, fetchData]);

    const handleFormSubmit = useCallback(async (
        data: AddressFormData,
        editingAddress: AdminAddress | null,
    ) => {
        setSaving(true);
        try {
            if (editingAddress) {
                await updateAddress({
                    id: editingAddress.id,
                    ...data,
                    userId: undefined // prevent sending if not in UpdateAddressData type
                } as any);
            } else {
                if (!data.userId) {
                    alert('Lütfen bir kullanıcı seçin.');
                    setSaving(false);
                    return;
                }
                await createAddress(data);
            }
            setModalOpen(false);
            setEditingAddress(null);
            await fetchData();
        } catch (err: unknown) {
            console.error('Adres kaydedilirken hata:', err);
            alert(parseApiError(err).message || 'Kaydedilemedi.');
        } finally {
            setSaving(false);
        }
    }, [setModalOpen, setEditingAddress, fetchData]);

    return { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleFormSubmit };
}
