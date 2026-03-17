import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Palette } from 'lucide-react';
import { getAdminStoreSettings, updateStoreSettings } from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { useStoreSettings } from '@/context/StoreSettingsContext';

// ── helpers ────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ── System fonts — cross-browser safe ──────────────────────────────────────

const SYSTEM_FONTS: { value: string; label: string }[] = [
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { value: "'Helvetica Neue', Helvetica, Arial, sans-serif", label: 'Helvetica Neue' },
    { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
    { value: "'Trebuchet MS', Helvetica, sans-serif", label: 'Trebuchet MS' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
    { value: "'Palatino Linotype', Palatino, serif", label: 'Palatino' },
    { value: "'Courier New', Courier, monospace", label: 'Courier New' },
    { value: "'Lucida Console', Monaco, monospace", label: 'Lucida Console' },
];

// ── Shared sub-components ──────────────────────────────────────────────────

function ColorPicker({
    label,
    description,
    value,
    onChange,
}: {
    label: string;
    description?: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <span className="block text-sm font-semibold mb-0.5 text-foreground">{label}</span>
            {description && <p className="text-xs mb-2 text-muted-foreground">{description}</p>}
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5 flex-shrink-0"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-28 border border-border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 bg-background text-foreground"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}

function FontSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 bg-background text-foreground"
            style={{ fontFamily: value, minWidth: 140 }}
        >
            {SYSTEM_FONTS.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                </option>
            ))}
        </select>
    );
}

/** Row: label | color picker | font selector — used in Metin Renkleri & Stilleri section */
function TextStyleRow({
    label,
    colorValue,
    fontValue,
    onColorChange,
    onFontChange,
}: {
    label: string;
    colorValue: string;
    fontValue: string;
    onColorChange: (v: string) => void;
    onFontChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
            <span className="text-sm flex-1 min-w-0 truncate text-foreground">{label}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <input
                    type="color"
                    value={colorValue}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5"
                    title="Renk seç"
                />
                <input
                    type="text"
                    value={colorValue}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-24 border border-border rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 bg-background text-foreground"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                />
            </div>
            <FontSelect value={fontValue} onChange={onFontChange} />
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function AdminColorsPage() {
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
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

    // Convenience: set footer nested color
    const setFooterBg = (v: string) =>
        setForm((prev) => prev ? { ...prev, footer: { ...prev.footer, backgroundColor: v } } : prev);

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hexToRgba(settings.primaryColor, 0.1) }}
                >
                    <Palette className="w-5 h-5" style={{ color: settings.primaryColor }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: settings.primaryColor }}>
                        Renk &amp; Font
                    </h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        Alan renkleri, metin renkleri ve yazı tipi ayarları
                    </p>
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
                {/* ══════════════════════════════════════════════════
                    BÖLÜM 1 — KISIM RENKLERİ (background colors)
                ══════════════════════════════════════════════════ */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Kısım Renkleri
                    </h2>
                    <p className="text-xs -mt-2" style={{ color: '#9ca3af' }}>
                        Her alanın arka plan / dolgu rengi
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ColorPicker
                            label="Marka Ana Rengi"
                            description="Butonlar, odak halkası, admin aksan rengi"
                            value={form.primaryColor}
                            onChange={(v) => set('primaryColor', v)}
                        />
                        <ColorPicker
                            label="Header Arka Plan Rengi"
                            description="Üst navigasyon çubuğunun zemin rengi"
                            value={form.headerBackgroundColor}
                            onChange={(v) => set('headerBackgroundColor', v)}
                        />
                        <ColorPicker
                            label="Banner (Kayan Yazı) Arka Planı"
                            description="Ücretsiz kargo bandının zemin rengi"
                            value={form.bannerBackgroundColor}
                            onChange={(v) => set('bannerBackgroundColor', v)}
                        />
                        <ColorPicker
                            label="Ana Sayfa Arka Plan Rengi"
                            description="Storefront genel zemin rengi"
                            value={form.backgroundColor}
                            onChange={(v) => set('backgroundColor', v)}
                        />
                        <ColorPicker
                            label="Footer Arka Plan Rengi"
                            description="Alt bilgi bölümünün zemin rengi"
                            value={form.footer.backgroundColor ?? '#1F2937'}
                            onChange={setFooterBg}
                        />
                        <ColorPicker
                            label="Admin SideBar Arka Plan Rengi"
                            description="Admin paneli sol kenar çubuğu"
                            value={form.adminSidebarBackgroundColor}
                            onChange={(v) => set('adminSidebarBackgroundColor', v)}
                        />
                        <ColorPicker
                            label="Admin Sayfaları Arka Plan Rengi"
                            description="Admin içerik alanının zemin rengi"
                            value={form.adminPageBackgroundColor}
                            onChange={(v) => set('adminPageBackgroundColor', v)}
                        />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    BÖLÜM 2 — METİN RENKLERİ & STİLLERİ
                ══════════════════════════════════════════════════ */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
                        Metin Renkleri &amp; Fontları
                    </h2>
                    <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>
                        Her metin alanı için renk ve yazı tipi. Fontlar tüm tarayıcılarda sorunsuz çalışır.
                    </p>

                    {/* Table header */}
                    <div className="flex items-center gap-3 py-1.5 mb-1 border-b border-border">
                        <span className="flex-1 text-xs font-bold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Alan</span>
                        <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0" style={{ color: '#9ca3af', minWidth: 128 }}>Renk</span>
                        <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0" style={{ color: '#9ca3af', minWidth: 140 }}>Font</span>
                    </div>

                    {/* ── Header / Navbar grubu ── */}
                    <div className="pt-3 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Header &amp; Navigasyon
                        </span>
                    </div>

                    <TextStyleRow
                        label="Mağaza Adı"
                        colorValue={form.storeNameColor}
                        fontValue={form.storeNameFont}
                        onColorChange={(v) => set('storeNameColor', v)}
                        onFontChange={(v) => set('storeNameFont', v)}
                    />
                    <TextStyleRow
                        label="Avatar İç Metin (AY)"
                        colorValue={form.avatarTextColor}
                        fontValue={form.avatarTextFont}
                        onColorChange={(v) => set('avatarTextColor', v)}
                        onFontChange={(v) => set('avatarTextFont', v)}
                    />
                    <TextStyleRow
                        label="Header İcon Alt Yazıları (Favori, Sepet…)"
                        colorValue={form.headerIconTextColor}
                        fontValue={form.headerIconTextFont}
                        onColorChange={(v) => set('headerIconTextColor', v)}
                        onFontChange={(v) => set('headerIconTextFont', v)}
                    />
                    <TextStyleRow
                        label="Navbar Menü Buton Metin"
                        colorValue={form.navbarMenuTextColor}
                        fontValue={form.navbarMenuTextFont}
                        onColorChange={(v) => set('navbarMenuTextColor', v)}
                        onFontChange={(v) => set('navbarMenuTextFont', v)}
                    />

                    {/* ── Banner ── */}
                    <div className="pt-4 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Kayan Yazı Bandı
                        </span>
                    </div>
                    <TextStyleRow
                        label="Banner Metin"
                        colorValue={form.bannerTextColor}
                        fontValue={form.bannerTextFont}
                        onColorChange={(v) => set('bannerTextColor', v)}
                        onFontChange={(v) => set('bannerTextFont', v)}
                    />

                    {/* ── Sayfa geneli ── */}
                    <div className="pt-4 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Sayfa Geneli
                        </span>
                    </div>
                    <TextStyleRow
                        label="Sayfa Başlıkları"
                        colorValue={form.pageTitleColor}
                        fontValue={form.pageTitleFont}
                        onColorChange={(v) => set('pageTitleColor', v)}
                        onFontChange={(v) => set('pageTitleFont', v)}
                    />

                    {/* ── Ürün Kartı ── */}
                    <div className="pt-4 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Ürün Kartı
                        </span>
                    </div>
                    <TextStyleRow
                        label="Kategori Etiketi"
                        colorValue={form.productCardCategoryColor}
                        fontValue={form.productCardCategoryFont}
                        onColorChange={(v) => set('productCardCategoryColor', v)}
                        onFontChange={(v) => set('productCardCategoryFont', v)}
                    />
                    <TextStyleRow
                        label="Ürün Adı"
                        colorValue={form.productCardNameColor}
                        fontValue={form.productCardNameFont}
                        onColorChange={(v) => set('productCardNameColor', v)}
                        onFontChange={(v) => set('productCardNameFont', v)}
                    />
                    <TextStyleRow
                        label="Adet"
                        colorValue={form.productCardQuantityColor}
                        fontValue={form.productCardQuantityFont}
                        onColorChange={(v) => set('productCardQuantityColor', v)}
                        onFontChange={(v) => set('productCardQuantityFont', v)}
                    />
                    <TextStyleRow
                        label="Tutar (alt toplam)"
                        colorValue={form.productCardTotalColor}
                        fontValue={form.productCardTotalFont}
                        onColorChange={(v) => set('productCardTotalColor', v)}
                        onFontChange={(v) => set('productCardTotalFont', v)}
                    />
                    <TextStyleRow
                        label="Kart İçi Fiyat"
                        colorValue={form.productCardPriceColor}
                        fontValue={form.productCardPriceFont}
                        onColorChange={(v) => set('productCardPriceColor', v)}
                        onFontChange={(v) => set('productCardPriceFont', v)}
                    />
                    <TextStyleRow
                        label="Sepete Ekle / Çıkar Butonu"
                        colorValue={form.productCardButtonColor}
                        fontValue={form.productCardButtonFont}
                        onColorChange={(v) => set('productCardButtonColor', v)}
                        onFontChange={(v) => set('productCardButtonFont', v)}
                    />

                    {/* ── Admin Panel ── */}
                    <div className="pt-4 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Admin Paneli
                        </span>
                    </div>
                    <TextStyleRow
                        label="Admin SideBar Metin"
                        colorValue={form.adminSidebarTextColor}
                        fontValue={form.adminSidebarTextFont}
                        onColorChange={(v) => set('adminSidebarTextColor', v)}
                        onFontChange={(v) => set('adminSidebarTextFont', v)}
                    />
                    <TextStyleRow
                        label="Admin Sayfa Başlıkları"
                        colorValue={form.adminPageTitleColor}
                        fontValue={form.adminPageTitleFont}
                        onColorChange={(v) => set('adminPageTitleColor', v)}
                        onFontChange={(v) => set('adminPageTitleFont', v)}
                    />

                    {/* ── Footer ── */}
                    <div className="pt-4 pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d1d5db' }}>
                            Footer
                        </span>
                    </div>
                    <TextStyleRow
                        label="Footer Metin"
                        colorValue={form.footerTextColor}
                        fontValue={form.footerTextFont}
                        onColorChange={(v) => set('footerTextColor', v)}
                        onFontChange={(v) => set('footerTextFont', v)}
                    />
                </section>

                {/* ══════════════════════════════════════════════════
                    BÖLÜM 3 — CANLI ÖNİZLEME
                ══════════════════════════════════════════════════ */}
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Canlı Önizleme
                    </h2>

                    <div className="rounded-xl overflow-hidden border border-border">
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 py-3 gap-4"
                            style={{ backgroundColor: form.headerBackgroundColor }}
                        >
                            <span
                                className="text-sm font-bold"
                                style={{ color: form.storeNameColor, fontFamily: form.storeNameFont }}
                            >
                                {form.storeName || 'Mağaza Adı'}
                            </span>
                            <div className="flex gap-4">
                                {['Ürünler', 'Kategoriler', 'Hakkında'].map((item) => (
                                    <span
                                        key={item}
                                        className="text-xs font-medium"
                                        style={{ color: form.navbarMenuTextColor, fontFamily: form.navbarMenuTextFont }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            {/* Mock avatar */}
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{
                                    backgroundColor: form.primaryColor,
                                    color: form.avatarTextColor,
                                    fontFamily: form.avatarTextFont,
                                }}
                            >
                                AY
                            </div>
                        </div>

                        {/* Banner */}
                        {form.freeShippingBannerVisible && (
                            <div
                                className="py-1.5 text-center text-xs font-medium"
                                style={{
                                    backgroundColor: form.bannerBackgroundColor,
                                    color: form.bannerTextColor,
                                    fontFamily: form.bannerTextFont,
                                }}
                            >
                                {form.freeShippingBannerText}
                            </div>
                        )}

                        {/* Page body */}
                        <div className="px-4 py-5" style={{ backgroundColor: form.backgroundColor }}>
                            {/* Page title */}
                            <p
                                className="text-sm font-bold mb-3"
                                style={{ color: form.pageTitleColor, fontFamily: form.pageTitleFont }}
                            >
                                Tüm Ürünler
                            </p>

                            {/* Mock product card */}
                            <div className="inline-block bg-card rounded-xl border border-border shadow-sm p-3 w-40">
                                <div className="w-full h-20 bg-gray-100 dark:bg-white/10 rounded-lg mb-2" />
                                <p
                                    className="text-xs mb-0.5"
                                    style={{ color: form.productCardCategoryColor, fontFamily: form.productCardCategoryFont }}
                                >
                                    Kuruyemiş
                                </p>
                                <p
                                    className="text-xs font-semibold mb-1"
                                    style={{ color: form.productCardNameColor, fontFamily: form.productCardNameFont }}
                                >
                                    Antep Fıstığı
                                </p>
                                <p
                                    className="text-xs font-bold mb-2"
                                    style={{ color: form.productCardPriceColor, fontFamily: form.productCardPriceFont }}
                                >
                                    ₺149,90
                                </p>
                                <button
                                    type="button"
                                    className="w-full py-1 rounded-lg text-xs font-semibold text-white"
                                    style={{
                                        backgroundColor: form.productCardButtonColor,
                                        fontFamily: form.productCardButtonFont,
                                    }}
                                >
                                    Sepete Ekle
                                </button>
                            </div>
                        </div>

                        {/* Footer strip */}
                        <div
                            className="px-4 py-3"
                            style={{
                                backgroundColor: form.footer.backgroundColor ?? '#1F2937',
                            }}
                        >
                            <p
                                className="text-xs"
                                style={{ color: form.footerTextColor, fontFamily: form.footerTextFont }}
                            >
                                © 2025 {form.storeName} · Tüm hakları saklıdır.
                            </p>
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
        </div>
    );
}
