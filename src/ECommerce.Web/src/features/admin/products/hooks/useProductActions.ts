import { useCallback } from 'react';
import { parseApiError } from '@/api/errorHandling';
import { createProduct, updateProduct, deleteProduct, restoreProduct } from '../../api/adminApi';
import type { Product, Category } from '../../../catalog/types/product';
import type { ProductFormData } from '../components/ProductFormModal';

export interface ProductModalSettings {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    showConfirm: boolean;
    productId: string | null;
    actionType: 'delete' | 'restore' | 'duplicate_archived';
}

export const defaultProductModalSettings: ProductModalSettings = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    showConfirm: true,
    productId: null,
    actionType: 'delete',
};

interface UseProductActionsParams {
    products: Product[];
    categories: Category[];
    setModalSettings: React.Dispatch<React.SetStateAction<ProductModalSettings>>;
    setModalOpen: (open: boolean) => void;
    setEditingProduct: (product: Product | null) => void;
    setDeleting: (v: boolean) => void;
    setSaving: (v: boolean) => void;
    fetchData: () => Promise<void>;
}

export function useProductActions({
    products,
    categories,
    setModalSettings,
    setModalOpen,
    setEditingProduct,
    setDeleting,
    setSaving,
    fetchData,
}: UseProductActionsParams) {
    // ── Open edit modal ───────────────────────────────────────────────────────
    const handleEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    }, [setEditingProduct, setModalOpen]);

    // ── Delete confirmation ───────────────────────────────────────────────────
    const handleDelete = useCallback((id: string) => {
        setModalSettings({
            open: true,
            title: 'Ürünü Sil',
            message: 'Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.',
            confirmText: 'Sil',
            variant: 'danger',
            showConfirm: true,
            productId: id,
            actionType: 'delete',
        });
    }, [setModalSettings]);

    // ── Restore confirmation ──────────────────────────────────────────────────
    const handleRestore = useCallback((id: string) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const category = categories.find(c => c.id === product.categoryId);
        const isCategoryDeleted = category?.isDeleted;

        if (isCategoryDeleted) {
            // Force category selection via Edit Modal
            setEditingProduct({
                ...product,
                categoryId: '',
                isActive: true,
            });
            setModalOpen(true);
        } else {
            setModalSettings({
                open: true,
                title: 'Ürünü Geri Yükle',
                message: `"${product.name}" ürününü ve ilgili verilerini geri yüklemek istediğinizden emin misiniz?`,
                confirmText: 'Geri Yükle',
                variant: 'info',
                showConfirm: true,
                productId: id,
                actionType: 'restore',
            });
        }
    }, [products, categories, setEditingProduct, setModalOpen, setModalSettings]);

    // ── Confirm modal action (delete / restore) ───────────────────────────────
    const handleConfirmDelete = useCallback(async (modalSettings: ProductModalSettings) => {
        const { productId, actionType } = modalSettings;
        if (!productId) return;

        setDeleting(true);
        try {
            if (actionType === 'restore' || actionType === 'duplicate_archived') {
                await restoreProduct(productId);
            } else {
                await deleteProduct(productId);
            }
            setModalSettings(prev => ({ ...prev, open: false, productId: null }));
            await fetchData();
        } catch (err: unknown) {
            console.error('İşlem sırasında hata:', err);
            alert(parseApiError(err).message || 'İşlem sırasında bir hata oluştu.');
        } finally {
            setDeleting(false);
        }
    }, [setDeleting, setModalSettings, fetchData]);

    // ── Form submit (create / update) ─────────────────────────────────────────
    const handleFormSubmit = useCallback(async (
        data: ProductFormData,
        editingProduct: Product | null,
    ) => {
        setSaving(true);
        try {
            if (editingProduct) {
                if (editingProduct.isDeleted) {
                    await restoreProduct(editingProduct.id);
                }
                await updateProduct({
                    id: editingProduct.id,
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    price: data.price,
                    currency: data.currency,
                    categoryId: data.categoryId,
                    unitId: data.unitId,
                    isActive: data.isActive,
                });
            } else {
                await createProduct({
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    price: data.price,
                    currency: data.currency,
                    stockQuantity: data.stockQuantity,
                    categoryId: data.categoryId,
                    unitId: data.unitId,
                    isActive: data.isActive,
                });
            }
            setModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err: unknown) {
            const errorMsg = parseApiError(err).message || '';
            if (errorMsg.includes('ARCHIVED_DUPLICATE')) {
                const [, id, name] = errorMsg.split('|');
                setModalOpen(false);
                setModalSettings({
                    open: true,
                    title: 'Arşivde Bulundu',
                    message: `"${name}" isminde bir ürün daha önce silinmiş. Bu ürünü arşivdeki verileriyle beraber geri getirmek mi istersiniz, yoksa bu isimle tamamen yeni bir ürün mü oluşturmak istersiniz?`,
                    confirmText: 'Arşivdekini Geri Getir',
                    variant: 'info',
                    showConfirm: true,
                    productId: id,
                    actionType: 'duplicate_archived',
                });
            } else {
                console.error('Ürün kaydedilirken hata:', err);
                alert('Ürün kaydedilirken bir hata oluştu: ' + errorMsg);
            }
        } finally {
            setSaving(false);
        }
    }, [setModalOpen, setEditingProduct, setModalSettings, setSaving, fetchData]);

    return { handleEdit, handleDelete, handleRestore, handleConfirmDelete, handleFormSubmit };
}
