import { useCallback } from 'react';
import { parseApiError } from '@/api/errorHandling';
import { createUser, updateUser, deleteUser, restoreUser } from '../api/adminApi';
import type { AdminUser } from '../types/adminUser';
import type { UserFormData } from '../components/UserFormModal';

export interface UserModalSettings {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    showConfirm: boolean;
    userId: string | null;
    actionType: 'delete' | 'restore';
}

export const defaultUserModalSettings: UserModalSettings = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    showConfirm: true,
    userId: null,
    actionType: 'delete',
};

interface UseUserActionsParams {
    users: AdminUser[];
    setModalSettings: React.Dispatch<React.SetStateAction<UserModalSettings>>;
    setModalOpen: (open: boolean) => void;
    setEditingUser: (user: AdminUser | null) => void;
    setDeleting: (v: boolean) => void;
    setSaving: (v: boolean) => void;
    fetchData: () => Promise<void>;
}

export function useUserActions({
    users,
    setModalSettings,
    setModalOpen,
    setEditingUser,
    setDeleting,
    setSaving,
    fetchData,
}: UseUserActionsParams) {
    const handleEdit = useCallback((user: AdminUser) => {
        setEditingUser(user);
        setModalOpen(true);
    }, [setEditingUser, setModalOpen]);

    const handleDelete = useCallback((id: string, fullName: string) => {
        setModalSettings({
            open: true,
            title: 'Musteriyi Sil',
            message: `"${fullName}" musterisini silmek istediginizden emin misiniz? Bu islem geri alinabilir.`,
            confirmText: 'Sil',
            variant: 'danger',
            showConfirm: true,
            userId: id,
            actionType: 'delete',
        });
    }, [setModalSettings]);

    const handleRestore = useCallback((id: string) => {
        const user = users.find(u => u.id === id);
        if (!user) return;
        setModalSettings({
            open: true,
            title: 'Musteriyi Geri Yukle',
            message: `"${user.fullName}" musterisini geri yuklemek istediginizden emin misiniz?`,
            confirmText: 'Geri Yukle',
            variant: 'info',
            showConfirm: true,
            userId: id,
            actionType: 'restore',
        });
    }, [users, setModalSettings]);

    const handleConfirmAction = useCallback(async (modalSettings: UserModalSettings) => {
        const { userId, actionType } = modalSettings;
        if (!userId) return;
        setDeleting(true);
        try {
            if (actionType === 'restore') {
                await restoreUser(userId);
            } else {
                await deleteUser(userId);
            }
            setModalSettings(prev => ({ ...prev, open: false, userId: null }));
            await fetchData();
        } catch (err: unknown) {
            console.error('Islem sirasinda hata:', err);
            alert(parseApiError(err).message || 'Islem sirasinda bir hata olustu.');
        } finally {
            setDeleting(false);
        }
    }, [setDeleting, setModalSettings, fetchData]);

    const handleFormSubmit = useCallback(async (
        data: UserFormData,
        editingUser: AdminUser | null,
    ) => {
        setSaving(true);
        try {
            if (editingUser) {
                if (editingUser.isDeleted) {
                    await restoreUser(editingUser.id);
                }
                await updateUser({
                    id: editingUser.id,
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                    isActive: data.isActive,
                });
            } else {
                await createUser({
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                    isActive: data.isActive,
                });
            }
            setModalOpen(false);
            setEditingUser(null);
            await fetchData();
        } catch (err: unknown) {
            const errorMsg = parseApiError(err).message || '';
            console.error('Musteri kaydedilirken hata:', err);
            alert('Musteri kaydedilirken bir hata olustu: ' + errorMsg);
        } finally {
            setSaving(false);
        }
    }, [setModalOpen, setEditingUser, setSaving, fetchData]);

    return { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleFormSubmit };
}
