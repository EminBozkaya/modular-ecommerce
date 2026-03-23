import { useCallback } from 'react';
import { parseApiError } from '@/api/errorHandling';
import { createCategory, updateCategory, deleteCategory, restoreCategory } from '../../api/adminApi';
import type { Category, Product } from '../../../catalog/types/product';
import type { CategoryFormData } from '../components/CategoryFormModal';

export interface ModalSettings {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    showConfirm: boolean;
    categoryId: string | null;
    actionType: 'delete' | 'deactivate' | 'restore' | 'duplicate_archived';
}

export const defaultModalSettings: ModalSettings = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    showConfirm: true,
    categoryId: null,
    actionType: 'delete',
};

interface UseCategoryActionsParams {
    categories: Category[];
    products: Product[];
    setModalSettings: React.Dispatch<React.SetStateAction<ModalSettings>>;
    setModalOpen: (open: boolean) => void;
    setEditingCategory: (cat: Category | null) => void;
    setDeleting: (v: boolean) => void;
    setSaving: (v: boolean) => void;
    fetchData: () => Promise<void>;
}

export function useCategoryActions({
    categories,
    products,
    setModalSettings,
    setModalOpen,
    setEditingCategory,
    setDeleting,
    setSaving,
    fetchData,
}: UseCategoryActionsParams) {
    // ── Open edit modal ───────────────────────────────────────────────────────
    const handleEdit = useCallback((category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    }, [setEditingCategory, setModalOpen]);

    // ── Delete confirmation logic ─────────────────────────────────────────────
    const handleDelete = useCallback((id: string) => {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        const isRoot = !category.parentCategoryId;
        const subCats = categories.filter(c => c.parentCategoryId === id && !c.isDeleted);
        const hasProducts = products.some(p => p.categoryId === id);
        const subCatsWithProductsCount = subCats.filter(sc => products.some(p => p.categoryId === sc.id)).length;

        if (isRoot) {
            if (hasProducts || (subCats.length > 1 && subCatsWithProductsCount > 0) || subCatsWithProductsCount > 1) {
                setModalSettings({
                    open: true,
                    title: 'İşlem Engellendi',
                    message: hasProducts
                        ? 'Bu kategori içerisinde aktif ürünler bulunduğu için silinemez. Lütfen önce ürünleri başka bir kategoriye taşıyın.'
                        : 'Bu kategoriye bağlı alt kategorilerden en az birinde aktif ürün bulunmaktadır. Veri bütünlüğünü korumak adına bu kategori silinemez.',
                    confirmText: '',
                    variant: 'warning',
                    showConfirm: false,
                    categoryId: id,
                    actionType: 'delete',
                });
                return;
            }
            if (!hasProducts && subCats.length === 1 && subCatsWithProductsCount === 1) {
                setModalSettings({
                    open: true,
                    title: 'Kategori Terfisi',
                    message: `"${category.name}" ana kategorisi silinecektir. İçinde ürün bulunan tek alt kategorisi olan "${subCats[0].name}" artık yeni bir ana kategori olarak atanacaktır. Onaylıyor musunuz?`,
                    confirmText: 'Onayla ve Terfi Ettir',
                    variant: 'info',
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'delete',
                });
                return;
            }
            setModalSettings({
                open: true,
                title: 'Kategori Ağacını Sil',
                message: subCats.length > 0
                    ? `"${category.name}" ana kategorisi ve ona bağlı olan ${subCats.length} adet boş alt kategori kalıcı olarak silinecektir. Onaylıyor musunuz?`
                    : `"${category.name}" kategorisini silmek istediğinizden emin misiniz?`,
                confirmText: 'Sil',
                variant: 'danger',
                showConfirm: true,
                categoryId: id,
                actionType: 'delete',
            });
        } else {
            setModalSettings({
                open: true,
                title: hasProducts ? 'İşlem Engellendi' : 'Kategoriyi Sil',
                message: hasProducts
                    ? 'Bu kategori içerisinde aktif ürünler bulunduğu için silinemez. Lütfen önce ürünleri başka bir kategoriye taşıyın.'
                    : `"${category.name}" alt kategorisini silmek istediğinizden emin misiniz?`,
                confirmText: hasProducts ? '' : 'Sil',
                variant: hasProducts ? 'warning' : 'danger',
                showConfirm: !hasProducts,
                categoryId: id,
                actionType: 'delete',
            });
        }
    }, [categories, products, setModalSettings]);

    // ── Restore confirmation ──────────────────────────────────────────────────
    const handleRestore = useCallback((id: string) => {
        const category = categories.find(c => c.id === id);
        if (!category) return;
        setModalSettings({
            open: true,
            title: 'Kategoriyi Geri Yükle',
            message: `"${category.name}" kategorisini ve arşivdeki verilerini geri yüklemek istediğinizden emin misiniz?`,
            confirmText: 'Geri Yükle',
            variant: 'info',
            showConfirm: true,
            categoryId: id,
            actionType: 'restore',
        });
    }, [categories, setModalSettings]);

    // ── Confirm modal action (delete / deactivate / restore) ─────────────────
    const handleConfirmDelete = useCallback(async (modalSettings: ModalSettings) => {
        const { categoryId, actionType } = modalSettings;
        if (!categoryId) return;

        setDeleting(true);
        try {
            if (actionType === 'deactivate') {
                const cat = categories.find(c => c.id === categoryId);
                if (cat) {
                    await updateCategory({
                        id: cat.id,
                        name: cat.name,
                        description: cat.description ?? undefined,
                        imageUrl: cat.imageUrl ?? undefined,
                        isActive: false,
                        parentCategoryId: cat.parentCategoryId,
                    });
                }
            } else if (actionType === 'restore' || actionType === 'duplicate_archived') {
                await restoreCategory(categoryId);
            } else {
                await deleteCategory(categoryId);
            }
            setModalSettings(prev => ({ ...prev, open: false, categoryId: null }));
            await fetchData();
        } catch (err: unknown) {
            console.error('İşlem sırasında hata:', err);
            alert(parseApiError(err).message || 'İşlem sırasında bir hata oluştu.');
        } finally {
            setDeleting(false);
        }
    }, [categories, setDeleting, setModalSettings, fetchData]);

    // ── Form submit (create / update) ─────────────────────────────────────────
    const handleFormSubmit = useCallback(async (
        data: CategoryFormData,
        editingCategory: Category | null,
    ) => {
        if (editingCategory) {
            const willDeactivate = editingCategory.isActive && !data.isActive;
            if (willDeactivate) {
                const id = editingCategory.id;
                const hasProducts = products.some(p => p.categoryId === id);
                const subCats = categories.filter(c => c.parentCategoryId === id && !c.isDeleted);
                if (hasProducts || subCats.length > 0) {
                    setModalOpen(false);
                    setModalSettings({
                        open: true,
                        title: 'Kategoriyi Pasife Al',
                        message: 'Bu kategoriyi pasife alırsanız, satış ekranında bu kategoriniz ve altındaki bağlı tüm kategoriler ve ürünler satış için görünmeyecektir. Yine de pasife almak istediğinizden emin misiniz?',
                        confirmText: 'Evet, Pasife Çek',
                        variant: 'warning',
                        showConfirm: true,
                        categoryId: id,
                        actionType: 'deactivate',
                    });
                    return;
                }
            }
        }

        setSaving(true);
        try {
            if (editingCategory) {
                await updateCategory({
                    id: editingCategory.id,
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    isActive: data.isActive,
                    parentCategoryId: data.parentCategoryId || undefined,
                });
            } else {
                await createCategory({
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    isActive: data.isActive,
                    parentCategoryId: data.parentCategoryId || undefined,
                });
            }
            setModalOpen(false);
            setEditingCategory(null);
            await fetchData();
        } catch (err: unknown) {
            const errorMsg = parseApiError(err).message || '';
            if (errorMsg.includes('ARCHIVED_DUPLICATE')) {
                const [, id, name] = errorMsg.split('|');
                setModalOpen(false);
                setModalSettings({
                    open: true,
                    title: 'Arşivde Bulundu',
                    message: `"${name}" isminde bir kategori daha önce silinmiş. Bu kategoriyi arşivdeki verileriyle beraber geri getirmek ister misiniz?`,
                    confirmText: 'Geri Getir',
                    variant: 'info',
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'duplicate_archived',
                });
            } else {
                console.error('Kategori kaydedilirken hata:', err);
                alert('Kategori kaydedilirken bir hata oluştu: ' + errorMsg);
            }
        } finally {
            setSaving(false);
        }
    }, [categories, products, setModalOpen, setModalSettings, setEditingCategory, setSaving, fetchData]);

    return { handleEdit, handleDelete, handleRestore, handleConfirmDelete, handleFormSubmit };
}
