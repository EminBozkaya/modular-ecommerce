import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, Category, Unit } from '../../../catalog/types/product';
import { X, Globe } from 'lucide-react';
import { useProductSchema, type ProductFormData } from '@/lib/validations/admin.schema';
import { getProductTranslations, upsertProductTranslation, type TranslationData } from '../../api/adminApi';

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

const NON_DEFAULT_LANGS = [
    { code: 'en', label: 'İngilizce', flag: '🇬🇧' },
    { code: 'de', label: 'Almanca', flag: '🇩🇪' },
];

type TabId = 'genel' | 'ceviri';

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

    const [activeTab, setActiveTab] = useState<TabId>('genel');
    const [activeLang, setActiveLang] = useState('en');
    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({
        en: { name: '', description: '' },
        de: { name: '', description: '' },
    });
    const [translationSaving, setTranslationSaving] = useState(false);
    const [translationSaved, setTranslationSaved] = useState(false);
    const [translationError, setTranslationError] = useState('');

    const isEdit = !!product;

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
        setActiveTab('genel');
        setTranslations({ en: { name: '', description: '' }, de: { name: '', description: '' } });
        setTranslationSaved(false);
        setTranslationError('');
    }, [product, open, reset]);

    // Load existing translations when editing
    useEffect(() => {
        if (!open || !product?.id) return;
        getProductTranslations(product.id)
            .then((data: TranslationData[]) => {
                setTranslations(prev => {
                    const next = { ...prev };
                    for (const t of data) {
                        if (next[t.languageCode] !== undefined) {
                            next[t.languageCode] = { name: t.name, description: t.description || '' };
                        }
                    }
                    return next;
                });
            })
            .catch(() => { /* non-critical, silently skip */ });
    }, [open, product?.id]);

    const handleTranslationSave = useCallback(async () => {
        if (!product?.id) return;
        setTranslationSaving(true);
        setTranslationSaved(false);
        setTranslationError('');
        try {
            const tasks = NON_DEFAULT_LANGS
                .filter(l => translations[l.code]?.name?.trim())
                .map(l =>
                    upsertProductTranslation(product.id, l.code, {
                        name: translations[l.code].name.trim(),
                        description: translations[l.code].description.trim() || undefined,
                    })
                );
            await Promise.all(tasks);
            setTranslationSaved(true);
            setTimeout(() => setTranslationSaved(false), 3000);
        } catch {
            setTranslationError('Çeviriler kaydedilirken bir hata oluştu.');
        } finally {
            setTranslationSaving(false);
        }
    }, [product?.id, translations]);

    if (!open) return null;

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
                : 'border-gray-300 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'
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
                    style={{ background: 'var(--brand-primary)', color: 'white' }}
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

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setActiveTab('genel')}
                        className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'genel'
                                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Genel
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('ceviri')}
                        className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'ceviri'
                                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Globe className="h-4 w-4" />
                        Çeviriler
                    </button>
                </div>

                {/* Genel Tab */}
                {activeTab === 'genel' && (
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                        {product?.isDeleted && !product.categoryId && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-medium">
                                <p>Bu ürünün bağlı olduğu eski kategori silinmiş. Lütfen devam etmek için yeni bir aktif kategori seçin.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR) *</label>
                            <input
                                {...register('name')}
                                className={inputClass(!!errors.name)}
                                placeholder="Türkçe ürün adı"
                            />
                            {errorMsg(errors.name?.message)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (TR)</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none transition-colors ${errors.description ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30' : 'border-gray-300 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'}`}
                                placeholder="Türkçe ürün açıklaması"
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
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
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
                                style={{ background: 'var(--brand-primary)' }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-primary-dark)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-primary)')}
                            >
                                {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Çeviriler Tab */}
                {activeTab === 'ceviri' && (
                    <div className="p-6 space-y-5">
                        {!isEdit ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                                <Globe className="h-10 w-10 mb-3 text-gray-300" />
                                <p className="text-sm font-medium">Çeviri eklemek için önce ürünü kaydedin.</p>
                            </div>
                        ) : (
                            <>
                                {/* Language sub-tabs */}
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                    {NON_DEFAULT_LANGS.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                                activeLang === lang.code
                                                    ? 'bg-white shadow-sm text-[var(--brand-primary)]'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Translation fields for active language */}
                                {NON_DEFAULT_LANGS.map(lang =>
                                    activeLang === lang.code ? (
                                        <div key={lang.code} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ürün Adı ({lang.label})
                                                </label>
                                                <input
                                                    type="text"
                                                    value={translations[lang.code]?.name ?? ''}
                                                    onChange={(e) => setTranslations(prev => ({
                                                        ...prev,
                                                        [lang.code]: { ...prev[lang.code], name: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] text-sm transition-colors"
                                                    placeholder={`Ürün adı (${lang.label})`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Açıklama ({lang.label})
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={translations[lang.code]?.description ?? ''}
                                                    onChange={(e) => setTranslations(prev => ({
                                                        ...prev,
                                                        [lang.code]: { ...prev[lang.code], description: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] text-sm resize-none transition-colors"
                                                    placeholder={`Ürün açıklaması (${lang.label})`}
                                                />
                                            </div>
                                        </div>
                                    ) : null
                                )}

                                {/* Feedback */}
                                {translationError && (
                                    <p className="text-xs font-semibold text-red-600">{translationError}</p>
                                )}
                                {translationSaved && (
                                    <p className="text-xs font-semibold text-green-600">Çeviriler başarıyla kaydedildi ✓</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Kapat
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleTranslationSave}
                                        disabled={translationSaving}
                                        className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                                        style={{ background: 'var(--brand-primary)' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-primary-dark)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-primary)')}
                                    >
                                        {translationSaving ? 'Kaydediliyor...' : 'Tüm Çevirileri Kaydet'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
