import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { getAdminStoreSettings, updateStoreSettings } from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { useStoreSettings } from '@/context/StoreSettingsContext';

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

export default function AdminBannerPage() {
    const queryClient = useQueryClient();
    const settings = useStoreSettings();

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
                    style={{ borderColor: settings.primaryColor, borderTopColor: 'transparent' }}
                />
            </div>
        );
    }
    if (isError) {
        return <div className="py-24 text-center text-red-600">Ayarlar yüklenemedi.</div>;
    }

    const set = <K extends keyof StoreSettingsDto>(key: K, value: StoreSettingsDto[K]) =>
        setForm((prev) => prev ? { ...prev, [key]: value } : prev);

    const marqueeDuration = (11 - form.freeShippingBannerMarqueeSpeed) * 3;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hexToRgba(settings.primaryColor, 0.1) }}
                >
                    <Megaphone className="w-5 h-5" style={{ color: settings.primaryColor }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: settings.primaryColor }}>Kayan Yazı</h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Ücretsiz kargo bandı ayarları</p>
                </div>
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); if (form) mutate(form); }}
                className="space-y-8"
                style={{
                    '--primary': settings.primaryColor,
                    '--tw-ring-color': settings.primaryColor,
                    accentColor: settings.primaryColor,
                } as React.CSSProperties}
            >
                {/* ── Banner Görünürlük & Metin ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Banner İçeriği
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-foreground">
                            Banner Metni
                        </label>
                        <input
                            type="text"
                            value={form.freeShippingBannerText}
                            onChange={(e) => set('freeShippingBannerText', e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-background text-foreground"
                            placeholder="Örn: Ücretsiz kargo fırsatını kaçırma!"
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
                            <span className="text-sm font-medium text-foreground">
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
                                <span className="text-sm font-medium text-foreground">
                                    Kayan yazı (marquee)
                                </span>
                                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                                    Aktif olduğunda metin sağdan sola kayan bant şeklinde gösterilir.
                                </p>
                            </div>
                        </label>
                    </div>

                    {form.freeShippingBannerMarquee && (
                        <div className="pl-7 pt-1">
                            <label className="block text-sm font-semibold mb-2 text-foreground">
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

                {/* ── Banner Renkleri ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Banner Renkleri
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-foreground">
                            Arka Plan Rengi
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={form.bannerBackgroundColor}
                                onChange={(e) => set('bannerBackgroundColor', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                            />
                            <input
                                type="text"
                                value={form.bannerBackgroundColor}
                                onChange={(e) => set('bannerBackgroundColor', e.target.value)}
                                className="w-32 border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 bg-background text-foreground"
                                pattern="^#[0-9A-Fa-f]{6}$"
                                placeholder="#243342"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-foreground">
                            Metin Rengi
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={form.bannerTextColor}
                                onChange={(e) => set('bannerTextColor', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                            />
                            <input
                                type="text"
                                value={form.bannerTextColor}
                                onChange={(e) => set('bannerTextColor', e.target.value)}
                                className="w-32 border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 bg-background text-foreground"
                                pattern="^#[0-9A-Fa-f]{6}$"
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Submit ── */}
                <div className="flex items-center justify-between">
                    {isSuccess && (
                        <span className="text-sm font-medium" style={{ color: settings.primaryColor }}>
                            Kaydedildi.
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

            {/* ── Canlı Önizleme ── */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-border text-muted-foreground">
                    Canlı Önizleme — Kayan Yazı Bandı
                </p>

                {form.freeShippingBannerVisible ? (
                    <div
                        className="overflow-hidden py-2"
                        style={{ backgroundColor: form.bannerBackgroundColor }}
                    >
                        {form.freeShippingBannerMarquee ? (
                            <div
                                className="animate-marquee-track text-xs font-medium"
                                style={{
                                    animationDuration: `${marqueeDuration}s`,
                                    color: form.bannerTextColor,
                                    fontFamily: form.bannerTextFont,
                                }}
                            >
                                {form.freeShippingBannerText}
                            </div>
                        ) : (
                            <p
                                className="text-center text-xs font-medium"
                                style={{ color: form.bannerTextColor, fontFamily: form.bannerTextFont }}
                            >
                                {form.freeShippingBannerText}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                            Band gizli — "Bandı göster" seçeneğini etkinleştirin
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
