import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Globe } from 'lucide-react';
import type { Category } from '../../../catalog/types/product';
import { useCategorySchema, type CategoryFormData } from '@/lib/validations/admin.schema';
import { getCategoryTranslations, upsertCategoryTranslation, type TranslationData } from '../../api/adminApi';

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

const NON_DEFAULT_LANGS = [
    { code: 'en', label: 'İngilizce', flag: '🇬🇧' },
    { code: 'de', label: 'Almanca', flag: '🇩🇪' },
];

type TabId = 'genel' | 'ceviri';

export default function CategoryFormModal({
    open,
    onClose,
    onSubmit,
    category,
    categories,
    loading,
}: CategoryFormModalProps) {
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
    const [activeLang, setActiveLang] = useState('en');
    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({
        en: { name: '', description: '' },
        de: { name: '', description: '' },
    });
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
        setTranslations({ en: { name: '', description: '' }, de: { name: '', description: '' } });
        setTranslationSaved(false);
        setTranslationError('');
    }, [open, category, reset]);

    // Load existing translations when editing
    useEffect(() => {
        if (!open || !category?.id) return;
        getCategoryTranslations(category.id)
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
    }, [open, category?.id]);

    const handleTranslationSave = useCallback(async () => {
        if (!category?.id) return;
        setTranslationSaving(true);
        setTranslationSaved(false);
        setTranslationError('');
        try {
            const tasks = NON_DEFAULT_LANGS
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

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setActiveTab('genel')}
                        className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'genel'
                                ? 'border-[#1B5E3F] text-[#1B5E3F]'
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
                                ? 'border-[#1B5E3F] text-[#1B5E3F]'
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı (TR) *</label>
                            <input
                                {...register('name')}
                                className={inputClass(!!errors.name)}
                                placeholder="Türkçe kategori adı"
                            />
                            {errorMsg(errors.name?.message)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (TR)</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none transition-colors ${errors.description ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30' : 'border-gray-300 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]'}`}
                                placeholder="Türkçe kategori açıklaması"
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
                )}

                {/* Çeviriler Tab */}
                {activeTab === 'ceviri' && (
                    <div className="p-6 space-y-5">
                        {!isEdit ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                                <Globe className="h-10 w-10 mb-3 text-gray-300" />
                                <p className="text-sm font-medium">Çeviri eklemek için önce kategoriyi kaydedin.</p>
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
                                                    ? 'bg-white shadow-sm text-[#1B5E3F]'
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
                                                    Kategori Adı ({lang.label})
                                                </label>
                                                <input
                                                    type="text"
                                                    value={translations[lang.code]?.name ?? ''}
                                                    onChange={(e) => setTranslations(prev => ({
                                                        ...prev,
                                                        [lang.code]: { ...prev[lang.code], name: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F] text-sm transition-colors"
                                                    placeholder={`Kategori adı (${lang.label})`}
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F] text-sm resize-none transition-colors"
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
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Kapat
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleTranslationSave}
                                        disabled={translationSaving}
                                        className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                                        style={{ background: '#1B5E3F' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
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
