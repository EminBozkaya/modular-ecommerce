import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Image, Paintbrush } from 'lucide-react';
import {
    getAdminStoreSettings,
    updateStoreSettings,
} from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { useStoreSettings } from '@/context/StoreSettingsContext';

// ── helpers ────────────────────────────────────────────────────────────────

/** Converts a 6-digit hex color to rgba() string for inline styles. */
function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ── sub-components ──────────────────────────────────────────────────────────

interface ImageUploadFieldProps {
    label: string;
    value?: string;
    onChange: (base64: string | undefined) => void;
    hint?: string;
}

function ImageUploadField({ label, value, onChange, hint }: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        const base64 = await fileToBase64(file);
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
                        className="max-h-32 max-w-xs object-contain rounded-xl border border-gray-200 bg-gray-50 p-3"
                    />
                    {/* Hover overlay with change / remove actions */}
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            <Upload className="w-3 h-3" />
                            Değiştir
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(undefined)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 rounded-lg text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Sil
                        </button>
                    </div>
                </div>
            ) : (
                /*
                 * hover:border-[var(--primary)] uses the CSS variable set on the
                 * ancestor <form> element so the upload zone border adapts to the
                 * store's primary color without prop-drilling.
                 */
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-40 h-28 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--primary)] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <Upload className="w-6 h-6 mb-1" style={{ color: '#9ca3af' }} />
                    <span className="text-xs" style={{ color: '#9ca3af' }}>Görsel seç</span>
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

// ── main page ───────────────────────────────────────────────────────────────

export default function AdminBrandDesignPage() {
    const queryClient = useQueryClient();

    /*
     * useStoreSettings() reads the live store settings from context (populated
     * by the public GET /api/store/settings query). These are the SAVED values
     * in the DB — used to colour the admin chrome (icon, title, button) so the
     * page itself always reflects the current brand, not the in-progress draft.
     */
    const settings = useStoreSettings();

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
                    style={{ borderColor: settings.primaryColor, borderTopColor: 'transparent' }}
                />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-24 text-center text-red-600">
                Ayarlar yüklenemedi. Lütfen sayfayı yenileyin.
            </div>
        );
    }

    const set = <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) =>
        setForm((prev) => prev ? { ...prev, [key]: value } : prev);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form) mutate(form);
    };

    const marqueeDuration = (11 - form.freeShippingBannerMarqueeSpeed) * 3;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Page header — icon + title use the live DB primary color */}
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hexToRgba(settings.primaryColor, 0.1) }}
                >
                    <Paintbrush className="w-5 h-5" style={{ color: settings.primaryColor }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: settings.primaryColor }}>
                        Marka &amp; Görünüm
                    </h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        Logo, renkler ve arka plan ayarları
                    </p>
                </div>
            </div>

            {/*
             * Three CSS cascade tricks applied to the <form>:
             *
             * 1. --primary: CSS variable → used by hover:border-[var(--primary)]
             *    in ImageUploadField without prop drilling.
             *
             * 2. --tw-ring-color: overrides Tailwind's focus-ring colour token.
             *    All inputs inside use focus:ring-2 (no colour class needed).
             *
             * 3. accentColor: inherited CSS property → all <input type="checkbox">
             *    and <input type="range"> inside adopt the primary color for free.
             *
             * NOTE: we use settings.primaryColor (live DB value) not form.primaryColor
             * (draft) so the chrome colour is stable while the user edits it.
             */}
            <form
                onSubmit={handleSubmit}
                className="space-y-8"
                style={{
                    '--primary': settings.primaryColor,
                    '--tw-ring-color': settings.primaryColor,
                    accentColor: settings.primaryColor,
                } as React.CSSProperties}
            >
                {/* ── Section: Marka ─────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Marka Kimliği
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#374151' }}>
                            Mağaza Adı
                        </label>
                        <input
                            type="text"
                            value={form.storeName}
                            onChange={(e) => set('storeName', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            placeholder="Mağaza adını girin"
                        />
                    </div>

                    <ImageUploadField
                        label="Logo"
                        value={form.imageBase64}
                        onChange={(v) => set('imageBase64', v)}
                        hint="PNG veya SVG önerilir. Görselin üzerine gelince değiştirme seçenekleri görüntülenir."
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
                                Mağaza adını header'da göster
                            </span>
                            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                                Logonun sağında mağaza adı metin olarak görünür.
                                Logonuzda zaten mağaza adı varsa kapalı bırakabilirsiniz.
                            </p>
                        </div>
                    </label>
                </section>

                {/* ── Section: Arka Plan ─────────────────────────── */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Arka Plan Deseni
                    </h2>

                    <ImageUploadField
                        label="Desen Görseli"
                        value={form.backgroundPatternBase64}
                        onChange={(v) => set('backgroundPatternBase64', v)}
                        hint="Opsiyonel. Arka plan üzerinde tekrar eden desen olarak kullanılır."
                    />

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                            Desen Opaklığı — {form.backgroundPatternOpacity}%
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
                            <span>0 (Görünmez)</span>
                            <span>100 (Tam)</span>
                        </div>
                    </div>
                </section>

                {/* ── Section: Ücretsiz Kargo Banner ─────────────── */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Ücretsiz Kargo Bandı
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#374151' }}>
                            Banner Metni
                        </label>
                        <input
                            type="text"
                            value={form.freeShippingBannerText}
                            onChange={(e) => set('freeShippingBannerText', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.freeShippingBannerVisible}
                                onChange={(e) => set('freeShippingBannerVisible', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium" style={{ color: '#374151' }}>
                                Bandı göster
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.freeShippingBannerMarquee}
                                onChange={(e) => set('freeShippingBannerMarquee', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <div>
                                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                                    Kayan yazı (marquee)
                                </span>
                                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                                    Aktif olduğunda metin sağdan sola kayan bant şeklinde gösterilir.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Speed slider — visible only when marquee is active */}
                    {form.freeShippingBannerMarquee && (
                        <div className="pl-7 pt-1">
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                                Kayan Hız — {form.freeShippingBannerMarqueeSpeed} / 10
                            </label>
                            <input
                                type="range"
                                min={1}
                                max={10}
                                value={form.freeShippingBannerMarqueeSpeed}
                                onChange={(e) => set('freeShippingBannerMarqueeSpeed', Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                                <span>1 (Yavaş)</span>
                                <span>10 (Hızlı)</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── Submit ─────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    {isSuccess && (
                        <span className="text-sm font-medium" style={{ color: settings.primaryColor }}>
                            Ayarlar kaydedildi.
                        </span>
                    )}
                    <div className="ml-auto">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
                            style={{ background: settings.primaryColor }}
                        >
                            {isPending ? 'Kaydediliyor…' : 'Kaydet'}
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Live Preview — full header mockup ────────────── */}
            {form && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 border-b border-gray-100" style={{ color: '#9ca3af' }}>
                        Canlı Önizleme — Mağaza Header
                    </p>

                    <div className="relative" style={{ backgroundColor: form.backgroundColor }}>
                        {form.backgroundPatternBase64 && (
                            <div
                                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                                style={{
                                    backgroundImage: `url(${form.backgroundPatternBase64})`,
                                    opacity: form.backgroundPatternOpacity / 100,
                                }}
                            />
                        )}

                        {/* Header bar */}
                        <div
                            className="relative flex items-center justify-between px-5 py-3 gap-3"
                            style={{ backgroundColor: form.primaryColor }}
                        >
                            {/* Logo + store name */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {form.imageBase64 ? (
                                    <img src={form.imageBase64} alt="logo önizleme" className="h-8 object-contain" />
                                ) : (
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.2)' }}
                                    >
                                        <Image className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
                                    </div>
                                )}
                                {form.showStoreNameInHeader && (
                                    <span className="text-sm font-bold" style={{ color: form.navbarActiveColor }}>
                                        {form.storeName}
                                    </span>
                                )}
                            </div>

                            {/* Mock nav links */}
                            <div className="hidden sm:flex items-center gap-4">
                                {['Anasayfa', 'Ürünler', 'Hakkımızda'].map((item) => (
                                    <span
                                        key={item}
                                        className="text-xs font-medium"
                                        style={{ color: form.navbarActiveColor, opacity: 0.8 }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            {/* Mock action icons */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
                                <div className="w-6 h-6 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
                            </div>
                        </div>

                        {/* Free shipping banner */}
                        {form.freeShippingBannerVisible && (
                            <div
                                className="relative overflow-hidden py-1.5"
                                style={{ backgroundColor: form.primaryColor, filter: 'brightness(0.85)' }}
                            >
                                {form.freeShippingBannerMarquee ? (
                                    <div
                                        className="animate-marquee-track text-xs font-medium text-white"
                                        style={{ animationDuration: `${marqueeDuration}s` }}
                                    >
                                        {form.freeShippingBannerText}
                                    </div>
                                ) : (
                                    <p className="text-center text-xs font-medium text-white">
                                        {form.freeShippingBannerText}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Mock content skeleton */}
                        <div className="relative px-5 py-6 flex items-center justify-center gap-3">
                            <div className="w-20 h-7 rounded-lg" style={{ background: 'rgba(0,0,0,0.06)' }} />
                            <div className="w-32 h-7 rounded-lg" style={{ background: 'rgba(0,0,0,0.06)' }} />
                            <div className="w-24 h-7 rounded-lg" style={{ background: 'rgba(0,0,0,0.06)' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
