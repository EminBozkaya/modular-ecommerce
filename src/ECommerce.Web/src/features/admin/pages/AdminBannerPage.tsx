import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminStoreSettings, updateStoreSettings, getLocalizedText } from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { TranslatableInput } from '../components/TranslatableInput';
export default function AdminBannerPage() {
    const { t, i18n } = useTranslation('admin');
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

    const setTranslation = (lang: string, field: string, value: string) => {
        setForm(prev => {
            if (!prev) return prev;
            const translations = { ...(prev.translations || {}) };
            translations[lang] = { ...(translations[lang] || {}), [field]: value };
            return { ...prev, translations };
        });
    };

    // Constant speed marquee logic for preview
    const [previewMarqueeDuration, setPreviewMarqueeDuration] = useState(30);
    const previewTrackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (form.freeShippingBannerMarquee && previewTrackRef.current) {
            const updateDuration = () => {
                const width = previewTrackRef.current?.offsetWidth || 0;
                const pixelsPerSecond = (form.freeShippingBannerMarqueeSpeed * 20) + 40;
                if (width > 0) setPreviewMarqueeDuration(width / pixelsPerSecond);
            };
            updateDuration();
            const observer = new ResizeObserver(updateDuration);
            observer.observe(previewTrackRef.current);
            return () => observer.disconnect();
        }
    }, [form.freeShippingBannerMarquee, form.freeShippingBannerMarqueeSpeed, form.freeShippingBannerText, i18n.language]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-primary-light)' }}
                >
                    <Megaphone className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>{t('design.banner.title')}</h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{t('design.banner.subtitle')}</p>
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
                {/* ── Banner Content ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        {t('design.banner.sectionContent')}
                    </h2>

                    <div>
                        <TranslatableInput 
                            label={t('design.banner.textLabel')}
                            value={form.freeShippingBannerText}
                            onChange={(val) => set('freeShippingBannerText', val)}
                            translations={form.translations}
                            field="freeShippingBannerText"
                            onTranslationChange={setTranslation}
                            placeholder={t('design.banner.textPlaceholder')}
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
                                {t('design.banner.showBanner')}
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
                                    {t('design.banner.marquee')}
                                </span>
                                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                                    {t('design.banner.marqueeDesc')}
                                </p>
                            </div>
                        </label>
                    </div>

                    {form.freeShippingBannerMarquee && (
                        <div className="pl-7 pt-1">
                            <label className="block text-sm font-semibold mb-2 text-foreground">
                                {t('design.banner.speedLabel', { value: form.freeShippingBannerMarqueeSpeed })}
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
                                <span>{t('design.banner.speedMin')}</span>
                                <span>{t('design.banner.speedMax')}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── Banner Colors ── */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        {t('design.banner.sectionColors')}
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-foreground">
                            {t('design.banner.bgColor')}
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
                            {t('design.banner.textColor')}
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
                    {t('design.banner.previewTitle')}
                </p>

                {form.freeShippingBannerVisible ? (
                    <div
                        className="overflow-hidden py-2"
                        style={{ backgroundColor: form.bannerBackgroundColor }}
                    >
                        {form.freeShippingBannerMarquee ? (
                            <div
                                ref={previewTrackRef}
                                className={`animate-marquee-track text-xs font-medium ${i18n.language === 'ar' ? 'rtl' : ''}`}
                                style={{
                                    animationDuration: `${previewMarqueeDuration}s`,
                                    color: form.bannerTextColor,
                                    fontFamily: form.bannerTextFont,
                                }}
                            >
                                {getLocalizedText(form, 'freeShippingBannerText', i18n.language)}
                            </div>
                        ) : (
                            <p
                                className="text-center text-xs font-medium"
                                style={{ color: form.bannerTextColor, fontFamily: form.bannerTextFont }}
                            >
                                {getLocalizedText(form, 'freeShippingBannerText', i18n.language)}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                            {t('design.banner.hiddenInfo')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
