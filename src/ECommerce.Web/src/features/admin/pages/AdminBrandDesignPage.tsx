import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Image, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    getAdminStoreSettings,
    updateStoreSettings,
} from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
/** Normalize any uploaded logo to a 400×400 square PNG (object-contain, transparent bg). */

function normalizeLogoImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            
            // Resize proportionally to fit within MAX_DIM while maintaining aspect ratio (NO padding)
            const MAX_DIM = 800;
            const scale = Math.min(MAX_DIM / img.naturalWidth, MAX_DIM / img.naturalHeight, 1);
            
            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error('Canvas not supported')); return; }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}

interface ImageUploadFieldProps {
    label: string;
    value?: string;
    onChange: (base64: string | undefined) => void;
    hint?: string;
    changeLabel: string;
    deleteLabel: string;
    selectLabel: string;
}

function ImageUploadField({ label, value, onChange, hint, changeLabel, deleteLabel, selectLabel }: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        const base64 = await normalizeLogoImage(file);
        onChange(base64);
    };

    return (
        <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                {label}
            </label>
            {hint && <p className="text-xs mb-3" style={{ color: '#6b7280' }}>{hint}</p>}

            {value ? (
                <div className="relative group inline-block">
                    <img
                        src={value}
                        alt={label}
                        className="max-h-32 max-w-xs object-contain rounded-xl border border-border bg-gray-50 dark:bg-white/10 p-3"
                    />
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                            <Upload className="w-3 h-3" />
                            {changeLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(undefined)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 rounded-lg text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            {deleteLabel}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-40 h-28 border-2 border-dashed border-border rounded-xl hover:border-[var(--primary)] hover:bg-accent transition-colors cursor-pointer"
                >
                    <Upload className="w-6 h-6 mb-1" style={{ color: '#9ca3af' }} />
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{selectLabel}</span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                }}
            />
        </div>
    );
}

export default function AdminBrandDesignPage() {
    const { t } = useTranslation('admin');
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.admin.settings.store,
        queryFn: getAdminStoreSettings,
    });

    const [form, setForm] = useState<StoreSettingsDto | null>(null);

    useEffect(() => {
        if (data && !form) setForm(data);
    }, [data, form]);

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: updateStoreSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
            queryClient.invalidateQueries({ queryKey: queryKeys.store.settings });
        },
    });

    if (isLoading || !form) {
        return (
            <div className="flex items-center justify-center py-24">
                <div
                    className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}
                />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-24 text-center text-red-600">
                {t('design.common.loading')}
            </div>
        );
    }

    const set = <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) =>
        setForm((prev) => prev ? { ...prev, [key]: value } : prev);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form) mutate(form);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-primary-light)' }}
                >
                    <Store className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                        {t('design.brand.title')}
                    </h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        {t('design.brand.subtitle')}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
                style={{
                    '--primary': 'var(--brand-primary)',
                    '--tw-ring-color': 'var(--brand-primary)',
                    accentColor: 'var(--brand-primary)',
                } as React.CSSProperties}
            >
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        {t('design.brand.sectionTitle')}
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#374151' }}>
                            {t('design.brand.storeName')}
                        </label>
                        <input
                            type="text"
                            value={form.storeName}
                            onChange={(e) => set('storeName', e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-background text-foreground"
                            placeholder={t('design.brand.storeNamePlaceholder')}
                        />
                    </div>

                    <ImageUploadField
                        label={t('design.brand.logoLabel')}
                        value={form.imageBase64}
                        onChange={(v) => set('imageBase64', v)}
                        hint={t('design.brand.logoHint')}
                        changeLabel={t('design.common.change')}
                        deleteLabel={t('design.common.delete')}
                        selectLabel={t('design.common.selectImage')}
                    />

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.showStoreNameInHeader}
                            onChange={(e) => set('showStoreNameInHeader', e.target.checked)}
                            className="w-4 h-4 mt-0.5"
                        />
                        <div>
                            <span className="text-sm font-medium" style={{ color: '#374151' }}>
                                {t('design.brand.showInHeader')}
                            </span>
                            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                                {t('design.brand.showInHeaderHint')}
                            </p>
                        </div>
                    </label>
                </section>

                <div className="flex items-center justify-between">
                    {isSuccess && (
                        <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                            {t('design.common.saved')}
                        </span>
                    )}
                    <div className="ml-auto">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                            {isPending ? t('design.common.saving') : t('design.common.save')}
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Live Preview ── */}
            {form && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-border text-muted-foreground">
                        {t('design.brand.previewTitle')}
                    </p>
                    <div
                        className="flex items-center gap-3 px-5 py-4"
                        style={{ backgroundColor: form.headerBackgroundColor }}
                    >
                        {form.imageBase64 ? (
                            <img src={form.imageBase64} alt="logo" className="h-8 w-8 object-contain" />
                        ) : (
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(255,255,255,0.2)' }}
                            >
                                <Image className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
                            </div>
                        )}
                        {form.showStoreNameInHeader && (
                            <span
                                className="text-sm font-bold"
                                style={{ color: form.storeNameColor, fontFamily: form.storeNameFont }}
                            >
                                {form.storeName}
                            </span>
                        )}
                        <div className="flex items-center gap-3 ml-4">
                            {['Anasayfa', 'Ürünler', 'Hakkımızda'].map((item) => (
                                <span
                                    key={item}
                                    className="text-xs font-medium"
                                    style={{ color: form.navbarMenuTextColor, fontFamily: form.navbarMenuTextFont }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
