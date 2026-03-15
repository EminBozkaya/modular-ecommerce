import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import type { Category } from '../../../catalog/types/product';
import { categorySchema, type CategoryFormData } from '@/lib/validations/admin.schema';

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => void;
    category?: Category | null;
    categories: Category[];
    loading?: boolean;
}

// CategoryFormData artık admin.schema.ts'ten export edilir
export type { CategoryFormData };

export default function CategoryFormModal({
    open,
    onClose,
    onSubmit,
    category,
    categories,
    loading,
}: CategoryFormModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
            isActive: true,
            parentCategoryId: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (category) {
                reset({
                    name: category.name,
                    description: category.description || '',
                    imageUrl: category.imageUrl || '',
                    isActive: category.isActive !== undefined ? category.isActive : true,
                    parentCategoryId: category.parentCategoryId || '',
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    imageUrl: '',
                    isActive: true,
                    parentCategoryId: '',
                });
            }
        }
    }, [open, category, reset]);

    if (!open) return null;

    // Helper to format and sort category paths
    const getCategoryPath = (cat: Category) =>
        cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name;

    const sortedCategories = [...categories].sort((a, b) =>
        getCategoryPath(a).localeCompare(getCategoryPath(b))
    );

    const currentParentId = watch('parentCategoryId');

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
            hasError
                ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30'
                : 'border-gray-300 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]'
        }`;

    const errorMsg = (msg: string | undefined) =>
        msg ? <p className="mt-1 text-xs font-semibold text-red-600" role="alert">{msg}</p> : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: '#1B5E3F', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">{category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
                        <input
                            {...register('name')}
                            className={inputClass(!!errors.name)}
                            placeholder="Kategori adını girin"
                        />
                        {errorMsg(errors.name?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none transition-colors ${errors.description ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30' : 'border-gray-300 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]'}`}
                            placeholder="Kategori açıklaması"
                        />
                        {errorMsg(errors.description?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                        <input
                            {...register('imageUrl')}
                            className={inputClass(!!errors.imageUrl)}
                            placeholder="https://..."
                        />
                        {errorMsg(errors.imageUrl?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Üst Kategori (Opsiyonel)</label>
                        <select
                            {...register('parentCategoryId')}
                            className={inputClass(!!errors.parentCategoryId)}
                        >
                            <option value="">Ana Kategori (Yok)</option>
                            {sortedCategories
                                .filter(cat => {
                                    // Kategori düzenlenirken kendisini üst olarak seçemesin
                                    if (category && cat.id === category.id) return false;
                                    // Aktif olanları göster, fakat mevcut üst kategori pasif olsa bile seç
                                    return cat.isActive !== false || cat.id === currentParentId;
                                })
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name}
                                    </option>
                                ))
                            }
                        </select>
                        {errorMsg(errors.parentCategoryId?.message)}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Kategori Aktif (Sitede Gösterilsin mi?)</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                            style={{ background: '#1B5E3F' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            {loading ? 'Kaydediliyor...' : (category ? 'Güncelle' : 'Ekle')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
