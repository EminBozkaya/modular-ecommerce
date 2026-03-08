import { useState, useEffect } from 'react';
import type { Product, Category } from '../../../catalog/types/product';
import { X } from 'lucide-react';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
    product?: Product | null;
    categories: Category[];
    loading?: boolean;
}

export interface ProductFormData {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    currency: string;
    stockQuantity: number;
    categoryId: string;
    isActive: boolean;
}

const initialFormData: ProductFormData = {
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    currency: 'TRY',
    stockQuantity: 0,
    categoryId: '',
    isActive: true,
};

export default function ProductFormModal({
    open,
    onClose,
    onSubmit,
    product,
    categories,
    loading,
}: ProductFormModalProps) {
    const [form, setForm] = useState<ProductFormData>(initialFormData);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                description: product.description || '',
                imageUrl: product.imageUrl || '',
                price: product.priceAmount ?? product.price ?? 0,
                currency: product.priceCurrency || product.currency || 'TRY',
                stockQuantity: product.stockQuantity ?? 0,
                categoryId: product.categoryId || '',
                isActive: product.isActive ?? true,
            });
        } else {
            setForm(initialFormData);
        }
    }, [product, open]);

    if (!open) return null;

    const isEdit = !!product;

    // Helper to format and sort category paths
    const getCategoryPath = (cat: Category) =>
        cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name;

    const sortedCategories = [...categories].sort((a, b) =>
        getCategoryPath(a).localeCompare(getCategoryPath(b))
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setForm((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stockQuantity' ? Number(finalValue) : finalValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
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
                        {isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="Ürün adını girin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm resize-none"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="Ürün açıklaması"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                                style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı *</label>
                            <input
                                name="stockQuantity"
                                type="number"
                                min="0"
                                value={form.stockQuantity}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                                style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                        >
                            <option value="">Kategori seçin</option>
                            {sortedCategories
                                .filter(cat =>
                                    // Eğer yeni ürün ekleniyorsa sadece aktifleri göster
                                    // Eğer düzenleniyorsa, ürünün kendi kategorisiyse (pasif de olsa) göster, diğerleri aktif olmalı
                                    isEdit ? (cat.id === form.categoryId || cat.isActive !== false) : cat.isActive !== false
                                )
                                .map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
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
