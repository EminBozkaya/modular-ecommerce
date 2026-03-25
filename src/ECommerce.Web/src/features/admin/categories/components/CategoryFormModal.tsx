import { useEffect, useState, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import type { Category } from '../../../catalog/types/product';
import { useCategorySchema, type CategoryFormData } from '@/lib/validations/admin.schema';
import { getCategoryTranslations, type TranslationData } from '../../api/adminApi';
import { useLanguageConfig } from '@/hooks/useLanguageConfig';
import { TranslatableInput } from '../../components/TranslatableInput';

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData, translations?: Record<string, { name: string; description?: string }>) => void;
    category?: Category | null;
    categories: Category[];
    loading?: boolean;
}

// CategoryFormData artık admin.schema.ts'ten export edilir
export type { CategoryFormData };

const DEFAULT_LANG_CODE = 'tr';

export default function CategoryFormModal({
    open,
    onClose,
    onSubmit,
    category,
    categories,
    loading,
}: CategoryFormModalProps) {
    const { languages } = useLanguageConfig();
    const nonDefaultLangs = useMemo(
        () => languages.filter(l => l.code !== DEFAULT_LANG_CODE),
        [languages],
    );

    const categorySchema = useCategorySchema();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema) as Resolver<CategoryFormData>,
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
            isActive: true,
            parentCategoryId: '',
        },
    });

    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>(() =>
        Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }]))
    );

    const isEdit = !!category;

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
        setTranslations(Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }])));
        // nonDefaultLangs intentionally excluded: it is derived from store settings and is
        // semantically stable, but useLanguageConfig() returns a new array reference on every
        // render, making it an unstable dependency that causes an infinite useEffect loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category, reset]);

    // Load existing translations when editing
    useEffect(() => {
        if (!open || !category?.id) return;
        getCategoryTranslations(category.id)
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
    }, [open, category?.id]);

    const handleModalSubmit = (data: CategoryFormData) => {
        onSubmit(data, translations);
    };

    if (!open) return null;

    // Helper to format and sort category paths
    const getCategoryPath = (cat: Category) =>
        cat.parentCategoryName ? `${cat.parentCategoryName} > ${cat.name}` : cat.name;

    const sortedCategories = [...categories].sort((a, b) =>
        getCategoryPath(a).localeCompare(getCategoryPath(b))
    );

    const currentParentId = watch('parentCategoryId');

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
                className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: 'var(--brand-surface)', color: 'white' }}
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
                <form onSubmit={handleSubmit(handleModalSubmit)} className="p-6 space-y-4" noValidate>
                        <div>
                            <TranslatableInput
                                label="Kategori Adı"
                                value={watch('name')}
                                onChange={(val) => setValue('name', val)}
                                translations={translations as any}
                                field="name"
                                onTranslationChange={(lang, field, value) => setTranslations(prev => ({
                                    ...prev,
                                    [lang]: { ...prev[lang], [field as 'name']: value }
                                }))}
                                placeholder="Türkçe kategori adı"
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
                                placeholder="Türkçe kategori açıklaması"
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

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Üst Kategori (Opsiyonel)</label>
                            <select
                                {...register('parentCategoryId')}
                                className={inputClass(!!errors.parentCategoryId)}
                            >
                                <option value="">Ana Kategori (Yok)</option>
                                {sortedCategories
                                    .filter(cat => {
                                        if (category && cat.id === category.id) return false;
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
                                    className="w-4 h-4 text-green-600 border-border rounded focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-foreground">Kategori Aktif (Sitede Gösterilsin mi?)</span>
                            </label>
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
