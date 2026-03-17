import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Globe } from 'lucide-react';
import type { Category } from '../../../catalog/types/product';
import { useCategorySchema, type CategoryFormData } from '@/lib/validations/admin.schema';
import { getCategoryTranslations, upsertCategoryTranslation, type TranslationData } from '../../api/adminApi';
import { useLanguageConfig } from '@/hooks/useLanguageConfig';

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

const DEFAULT_LANG_CODE = 'tr';

type TabId = 'genel' | 'ceviri';

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

    const [activeTab, setActiveTab] = useState<TabId>('genel');
    const [activeLang, setActiveLang] = useState(() => nonDefaultLangs[0]?.code ?? 'en');
    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>(() =>
        Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }]))
    );
    const [translationSaving, setTranslationSaving] = useState(false);
    const [translationSaved, setTranslationSaved] = useState(false);
    const [translationError, setTranslationError] = useState('');

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
        setActiveTab('genel');
        setActiveLang(nonDefaultLangs[0]?.code ?? 'en');
        setTranslations(Object.fromEntries(nonDefaultLangs.map(l => [l.code, { name: '', description: '' }])));
        setTranslationSaved(false);
        setTranslationError('');
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

    const handleTranslationSave = useCallback(async () => {
        if (!category?.id) return;
        setTranslationSaving(true);
        setTranslationSaved(false);
        setTranslationError('');
        try {
            const tasks = nonDefaultLangs
                .filter(l => translations[l.code]?.name?.trim())
                .map(l =>
                    upsertCategoryTranslation(category.id, l.code, {
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
    }, [category?.id, translations]);

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
                    style={{ background: 'var(--brand-primary)', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">{category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border bg-gray-50 dark:bg-white/5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('genel')}
                        className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'genel'
                                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
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
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Globe className="h-4 w-4" />
                        Çeviriler
                    </button>
                </div>

                {/* Genel Tab */}
                {activeTab === 'genel' && (
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Kategori Adı (TR) *</label>
                            <input
                                {...register('name')}
                                className={inputClass(!!errors.name)}
                                placeholder="Türkçe kategori adı"
                            />
                            {errorMsg(errors.name?.message)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Açıklama (TR)</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none transition-colors bg-background text-foreground ${errors.description ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30 dark:bg-red-900/10' : 'border-border focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'}`}
                                placeholder="Türkçe kategori açıklaması"
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
                                {loading ? 'Kaydediliyor...' : (category ? 'Güncelle' : 'Ekle')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Çeviriler Tab */}
                {activeTab === 'ceviri' && (
                    <div className="p-6 space-y-5">
                        {!isEdit ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <Globe className="h-10 w-10 mb-3 text-muted-foreground/40" />
                                <p className="text-sm font-medium">Çeviri eklemek için önce kategoriyi kaydedin.</p>
                            </div>
                        ) : (
                            <>
                                {/* Language sub-tabs */}
                                <div className="flex flex-wrap gap-1 bg-accent p-1 rounded-lg">
                                    {nonDefaultLangs.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                                                activeLang === lang.code
                                                    ? 'bg-card shadow-sm text-[var(--brand-primary)]'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span className="uppercase">{lang.code}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Translation fields for active language */}
                                {nonDefaultLangs.map(lang =>
                                    activeLang === lang.code ? (
                                        <div key={lang.code} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    Kategori Adı ({lang.label})
                                                </label>
                                                <input
                                                    type="text"
                                                    value={translations[lang.code]?.name ?? ''}
                                                    onChange={(e) => setTranslations(prev => ({
                                                        ...prev,
                                                        [lang.code]: { ...prev[lang.code], name: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] text-sm transition-colors bg-background text-foreground"
                                                    placeholder={`Kategori adı (${lang.label})`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    Açıklama ({lang.label})
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={translations[lang.code]?.description ?? ''}
                                                    onChange={(e) => setTranslations(prev => ({
                                                        ...prev,
                                                        [lang.code]: { ...prev[lang.code], description: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] text-sm resize-none transition-colors bg-background text-foreground"
                                                    placeholder={`Kategori açıklaması (${lang.label})`}
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
                                        className="px-4 py-2 text-sm font-medium text-foreground bg-accent hover:bg-accent/80 rounded-lg transition-colors"
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
