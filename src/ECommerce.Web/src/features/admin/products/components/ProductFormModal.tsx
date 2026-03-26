import { useEffect, useState, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, Category, Unit } from '../../../catalog/types/product';
import { X } from 'lucide-react';
import { useProductSchema, type ProductFormData } from '@/lib/validations/admin.schema';
import { getProductTranslations, type TranslationData } from '../../api/adminApi';
import { useLanguageConfig } from '@/hooks/useLanguageConfig';
import { TranslatableInput } from '../../components/TranslatableInput';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData, translations?: Record<string, { name: string; description?: string }>) => void;
    product?: Product | null;
    categories: Category[];
    units: Unit[];
    loading?: boolean;
}

// ProductFormData artık ProductFormModal.tsx'ten değil admin.schema.ts'ten gelir
export type { ProductFormData };

const DEFAULT_LANG_CODE = 'tr';

export default function ProductFormModal({
    open,
    onClose,
    onSubmit,
    product,
    categories,
    units,
    loading,
}: ProductFormModalProps) {
    const { languages } = useLanguageConfig();
    const nonDefaultLangs = useMemo(
        () => languages.filter(l => l.code !== DEFAULT_LANG_CODE),
        [languages],
    );

    const productSchema = useProductSchema();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
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

    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>(() =>
        Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }]))
    );

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
        setTranslations(Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }])));
        // nonDefaultLangs intentionally excluded: it is derived from store settings and is
        // semantically stable, but useLanguageConfig() returns a new array reference on every
        // render, making it an unstable dependency that causes an infinite useEffect loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, open, reset]);

    // Load existing translations when editing
    useEffect(() => {
        if (!open || !product?.id) return;
        getProductTranslations(product.id)
            .then((data: TranslationData[]) => {
                setTranslations(prev => {
                    const next = { ...prev };
                    for (const t of data) {
                        if (t.languageCode !== DEFAULT_LANG_CODE) {
                            next[t.languageCode] = { name: t.name, description: t.description || '' };
                        }
                    }
                    return next;
                });
            })
            .catch(() => { /* non-critical, silently skip */ });
    }, [open, product?.id]);

    const handleModalSubmit = (data: ProductFormData) => {
        onSubmit(data, translations);
    };

    if (!open) return null;

    // Helper to format and sort category paths
    const getCategoryPath = (cat: Category) =>
        cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name;

    const sortedCategories = [...categories].sort((a, b) =>
        getCategoryPath(a).localeCompare(getCategoryPath(b))
    );

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors bg-background text-foreground ${
            hasError
                ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30 dark:bg-red-900/10'
                : 'border-border focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'
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
                className="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: 'var(--brand-surface)', color: 'white' }}
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
                <form onSubmit={handleSubmit(handleModalSubmit)} className="p-6 space-y-4" noValidate>
                        {product?.isDeleted && !product.categoryId && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-medium">
                                <p>Bu ürünün bağlı olduğu eski kategori silinmiş. Lütfen devam etmek için yeni bir aktif kategori seçin.</p>
                            </div>
                        )}

                        <div>
                            <TranslatableInput
                                label="Ürün Adı"
                                value={watch('name')}
                                onChange={(val) => setValue('name', val)}
                                translations={translations as any}
                                field="name"
                                onTranslationChange={(lang, field, value) => setTranslations(prev => ({
                                    ...prev,
                                    [lang]: { ...prev[lang], [field as 'name']: value }
                                }))}
                                placeholder="Türkçe ürün adı"
                                className={errors.name ? 'error' : ''}
                            />
                            {errorMsg(errors.name?.message)}
                        </div>

                        <div>
                            <TranslatableInput
                                label="Açıklama"
                                value={watch('description') || ''}
                                onChange={(val) => setValue('description', val)}
                                translations={translations as any}
                                field="description"
                                onTranslationChange={(lang, field, value) => setTranslations(prev => ({
                                    ...prev,
                                    [lang]: { ...prev[lang], [field as 'description']: value }
                                }))}
                                placeholder="Türkçe ürün açıklaması"
                                textarea
                                className={errors.description ? 'error' : ''}
                            />
                            {errorMsg(errors.description?.message)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Görsel URL</label>
                            <input
                                {...register('imageUrl')}
                                className={inputClass(!!errors.imageUrl)}
                                placeholder="https://..."
                            />
                            {errorMsg(errors.imageUrl?.message)}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Fiyat (₺) *</label>
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
                                <label className="block text-sm font-medium text-foreground mb-1">Stok Miktarı *</label>
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
                                <label className="block text-sm font-medium text-foreground mb-1">Kategori *</label>
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
                                <label className="block text-sm font-medium text-foreground mb-1">Birim *</label>
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

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/10 rounded-lg border border-border">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                            </label>
                            <div>
                                <span className="block text-sm font-semibold text-foreground">Ürün Aktif</span>
                                <span className="block text-xs text-muted-foreground">Bu ürün mağazada listelenecek mi?</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-foreground bg-accent hover:bg-accent/80 rounded-lg transition-colors"
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
                </div>
            </div>
        );
    }
