import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminStoreSettings, updateStoreSettings } from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function ImageUploadField({
    label,
    value,
    onChange,
    hint,
    changeLabel,
    deleteLabel,
    selectLabel,
}: {
    label: string;
    value?: string;
    onChange: (v: string | undefined) => void;
    hint?: string;
    changeLabel: string;
    deleteLabel: string;
    selectLabel: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
                {label}
            </label>
            {hint && <p className="text-xs mb-3" style={{ color: '#6b7280' }}>{hint}</p>}

            {value ? (
                <div className="relative group inline-block">
                    <img
                        src={value}
                        alt={label}
                        className="max-h-24 max-w-xs object-contain rounded-xl border border-border bg-gray-50 dark:bg-white/10 p-2"
                    />
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                        >
                            <Upload className="w-3 h-3" />
                            {changeLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(undefined)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 rounded-lg text-xs font-semibold text-white hover:bg-red-600"
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
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(await fileToBase64(file));
                    e.target.value = '';
                }}
            />
        </div>
    );
}

export default function AdminBackgroundPage() {
    const { t } = useTranslation('admin');
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.admin.settings.store,
        queryFn: getAdminStoreSettings,
    });

    const [form, setForm] = useState<StoreSettingsDto | null>(null);
    useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

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
        return <div className="py-24 text-center text-red-600">{t('design.common.loading')}</div>;
    }

    const set = <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) =>
        setForm((prev) => prev ? { ...prev, [key]: value } : prev);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-primary-light)' }}
                >
                    <Layers className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>{t('design.background.title')}</h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{t('design.background.subtitle')}</p>
                </div>
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); if (form) mutate(form); }}
                className="space-y-8"
                style={{
                    '--primary': 'var(--brand-primary)',
                    '--tw-ring-color': 'var(--brand-primary)',
                    accentColor: 'var(--brand-primary)',
                } as React.CSSProperties}
            >
                {/* ── Background Color ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        {t('design.background.sectionColor')}
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-foreground">
                            {t('design.background.colorLabel')}
                        </label>
                        <p className="text-xs mb-3" style={{ color: '#6b7280' }}>
                            {t('design.background.colorDesc')}
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={form.backgroundColor}
                                onChange={(e) => set('backgroundColor', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                            />
                            <input
                                type="text"
                                value={form.backgroundColor}
                                onChange={(e) => set('backgroundColor', e.target.value)}
                                className="w-32 border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 bg-background text-foreground"
                                pattern="^#[0-9A-Fa-f]{6}$"
                                placeholder="#F5F6F7"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Background Pattern ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        {t('design.background.sectionPattern')}
                    </h2>

                    <ImageUploadField
                        label={t('design.background.patternLabel')}
                        value={form.backgroundPatternBase64}
                        onChange={(v) => set('backgroundPatternBase64', v)}
                        hint={t('design.background.patternHint')}
                        changeLabel={t('design.common.change')}
                        deleteLabel={t('design.common.delete')}
                        selectLabel={t('design.common.selectImage')}
                    />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            {t('design.background.opacityLabel', { value: form.backgroundPatternOpacity })}
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={form.backgroundPatternOpacity}
                            onChange={(e) => set('backgroundPatternOpacity', Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                            <span>{t('design.background.opacityMin')}</span>
                            <span>{t('design.background.opacityMax')}</span>
                        </div>
                    </div>
                </section>

                {/* ── Submit ── */}
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
            <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-border text-muted-foreground">
                    {t('design.background.previewTitle')}
                </p>

                <div
                    className="relative px-6 py-10"
                    style={{ backgroundColor: form.backgroundColor, minHeight: 160 }}
                >
                    {/* Pattern overlay */}
                    {form.backgroundPatternBase64 && (
                        <div
                            className="absolute inset-0 bg-repeat bg-center pointer-events-none"
                            style={{
                                backgroundImage: `url(${form.backgroundPatternBase64})`,
                                opacity: form.backgroundPatternOpacity / 100,
                            }}
                        />
                    )}

                    {/* Mock content skeleton */}
                    <div className="relative flex flex-col gap-3">
                        <div className="flex gap-3">
                            <div className="w-24 h-32 rounded-xl bg-white/80 border border-gray-200/60 shadow-sm" />
                            <div className="w-24 h-32 rounded-xl bg-white/80 border border-gray-200/60 shadow-sm" />
                            <div className="w-24 h-32 rounded-xl bg-white/80 border border-gray-200/60 shadow-sm" />
                        </div>
                        <div className="h-3 w-48 rounded bg-black/10" />
                        <div className="h-3 w-32 rounded bg-black/08" />
                    </div>
                </div>
            </div>
        </div>
    );
}
