import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, Category, Unit } from '../../../catalog/types/product';
import { X } from 'lucide-react';
import { useProductSchema, type ProductFormData } from '@/lib/validations/admin.schema';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
    product?: Product | null;
    categories: Category[];
    units: Unit[];
    loading?: boolean;
}

// ProductFormData artık ProductFormModal.tsx'ten değil admin.schema.ts'ten gelir
export type { ProductFormData };

export default function ProductFormModal({
    open,
    onClose,
    onSubmit,
    product,
    categories,
    units,
    loading,
}: ProductFormModalProps) {
    const productSchema = useProductSchema();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
            price: 0,
            currency: 'TRY',
            stockQuantity: 0,
            categoryId: '',
            unitId: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                description: product.description || '',
                imageUrl: product.imageUrl || '',
                price: product.priceAmount ?? product.price ?? 0,
                currency: product.priceCurrency || product.currency || 'TRY',
                stockQuantity: product.stockQuantity ?? 0,
                categoryId: product.categoryId || '',
                unitId: product.unitId || '',
                isActive: product.isActive ?? true,
            });
        } else {
            reset({
                name: '',
                description: '',
                imageUrl: '',
                price: 0,
                currency: 'TRY',
                stockQuantity: 0,
                categoryId: '',
                unitId: '',
                isActive: true,
            });
        }
    }, [product, open, reset]);

    if (!open) return null;

    const isEdit = !!product;

    // Helper to format and sort category paths
    const getCategoryPath = (cat: Category) =>
        cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name;

    const sortedCategories = [...categories].sort((a, b) =>
        getCategoryPath(a).localeCompare(getCategoryPath(b))
    );

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
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: '#1B5E3F', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">
                        {product?.isDeleted ? 'Ürünü Geri Yükle ve Düzenle' : (isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                    {product?.isDeleted && !product.categoryId && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-medium">
                            <p>Bu ürünün bağlı olduğu eski kategori silinmiş. Lütfen devam etmek için yeni bir aktif kategori seçin.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                        <input
                            {...register('name')}
                            className={inputClass(!!errors.name)}
                            placeholder="Ürün adını girin"
                        />
                        {errorMsg(errors.name?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none transition-colors ${errors.description ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30' : 'border-gray-300 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]'}`}
                            placeholder="Ürün açıklaması"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('price', { valueAsNumber: true })}
                                className={inputClass(!!errors.price)}
                            />
                            {errorMsg(errors.price?.message)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı *</label>
                            <input
                                type="number"
                                min="0"
                                {...register('stockQuantity', { valueAsNumber: true })}
                                className={inputClass(!!errors.stockQuantity)}
                            />
                            {errorMsg(errors.stockQuantity?.message)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <select
                                {...register('categoryId')}
                                className={inputClass(!!errors.categoryId)}
                            >
                                <option value="">Kategori seçin</option>
                                {sortedCategories
                                    .filter(cat =>
                                        isEdit ? (cat.id === product?.categoryId || cat.isActive !== false) : cat.isActive !== false
                                    )
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name}
                                        </option>
                                    ))}
                            </select>
                            {errorMsg(errors.categoryId?.message)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Birim *</label>
                            <select
                                {...register('unitId')}
                                className={inputClass(!!errors.unitId)}
                            >
                                <option value="">Birim seçin</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            {errorMsg(errors.unitId?.message)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B5E3F]"></div>
                        </label>
                        <div>
                            <span className="block text-sm font-semibold text-gray-900">Ürün Aktif</span>
                            <span className="block text-xs text-gray-500">Bu ürün mağazada listelenecek mi?</span>
                        </div>
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
                            {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
