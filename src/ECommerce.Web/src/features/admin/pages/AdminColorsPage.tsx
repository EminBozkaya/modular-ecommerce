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

// ── color definitions ──────────────────────────────────────────────────────

type ColorEntry = {
    key: keyof StoreSettingsDto;
    label: string;
    description: string;
    impacts: string[];
};

const COLOR_ENTRIES: ColorEntry[] = [
    {
        key: 'primaryColor',
        label: 'Ana Renk',
        description:
            'Mağazanın temel kimlik rengi. Navbar arka planı, form butonları, bağlantı ikonları, ' +
            'tablo header vurguları, tarih seçici aktif günleri, odak (focus) halkaları ve ' +
            'admin panelinin sol kenar çubuğu bu rengi kullanır.',
        impacts: [
            'Navbar',
            'Butonlar',
            'Admin kenar çubuğu',
            'Tablo (AG Grid) teması',
            'Tarih seçici',
            'Form odak halkası',
            'İkon renkleri',
        ],
    },
    {
        key: 'navbarActiveColor',
        label: 'Navbar Metin Rengi',
        description:
            'Üst navigasyon çubuğundaki menü bağlantıları, mağaza adı ve navbar üzerindeki ' +
            'tüm metinlerin rengi. Ana renk üzerinde net okunabilir olacak şekilde seçin — ' +
            'genellikle beyaz (#FFFFFF) veya açık bir ton.',
        impacts: ['Menü bağlantıları', 'Mağaza adı (header)', 'Navbar ikonları'],
    },
    {
        key: 'backgroundColor',
        label: 'Sayfa Arka Planı',
        description:
            'Mağaza vitrininin genel zemin rengi. Ürün listesi, kategori filtresi, ' +
            'ürün detay ve diğer içerik sayfaları bu arka plan üzerine oturur.',
        impacts: ['Anasayfa', 'Ürün listesi', 'Kategori sayfaları', 'Ürün detay'],
    },
];

// ── main page ───────────────────────────────────────────────────────────────

export default function AdminColorsPage() {
    const queryClient = useQueryClient();

    /*
     * useStoreSettings() reads the SAVED (DB) values for colouring the page
     * chrome (icon badge, title, save button). Kept separate from the in-progress
     * draft so the chrome stays stable while the user is editing.
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
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form) mutate(form);
    };

    return (
        <div className="max-w-2xl mx-auto">
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
                        Renk Paleti
                    </h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        Mağaza genelinde kullanılan renkleri özelleştirin
                    </p>
                </div>
            </div>

            {/*
             * CSS cascade on <form>:
             *   --primary / --tw-ring-color → focus rings on text inputs
             *   accentColor → checkboxes + range sliders inside this form
             * We use settings.primaryColor (saved DB value) so the chrome
             * remains stable while the user edits form.primaryColor (draft).
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
                {/* ── Color Pickers ──────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Renk Seçenekleri
                    </h2>

                    {COLOR_ENTRIES.map(({ key, label, description, impacts }) => (
                        <div key={key}>
                            <label className="block text-sm font-semibold mb-1" style={{ color: '#374151' }}>
                                {label}
                            </label>
                            <p className="text-xs mb-3" style={{ color: '#6b7280' }}>
                                {description}
                            </p>

                            {/* Picker + hex input */}
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="color"
                                    value={(form[key] as string) ?? '#000000'}
                                    onChange={(e) => set(key, e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                                />
                                <input
                                    type="text"
                                    value={(form[key] as string) ?? ''}
                                    onChange={(e) => set(key, e.target.value)}
                                    className="w-32 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                    placeholder="#000000"
                                />
                            </div>

                            {/* Impact tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {impacts.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{
                                            background: hexToRgba(settings.primaryColor, 0.08),
                                            color: settings.primaryColor,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* ── Live Preview ───────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        Canlı Önizleme
                    </h2>

                    <div className="rounded-xl overflow-hidden border border-gray-200">
                        {/* Navbar */}
                        <div
                            className="flex items-center justify-between px-4 py-3"
                            style={{ backgroundColor: form.primaryColor }}
                        >
                            <span className="text-sm font-bold" style={{ color: form.navbarActiveColor }}>
                                {form.storeName || 'Mağaza Adı'}
                            </span>
                            <div className="flex gap-3">
                                {['Ürünler', 'Kategoriler', 'Hakkında'].map((item) => (
                                    <span
                                        key={item}
                                        className="text-xs font-medium"
                                        style={{ color: form.navbarActiveColor, opacity: 0.8 }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Page body */}
                        <div className="px-5 py-6" style={{ backgroundColor: form.backgroundColor }}>
                            <div className="flex flex-wrap gap-3 items-center">
                                {/* Filled button */}
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                                    style={{ backgroundColor: form.primaryColor }}
                                >
                                    Sepete Ekle
                                </button>

                                {/* Outline button */}
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg text-xs font-semibold border bg-white"
                                    style={{ color: form.primaryColor, borderColor: form.primaryColor }}
                                >
                                    İncele
                                </button>

                                {/* Focus ring */}
                                <div
                                    className="px-3 py-1.5 rounded-lg border bg-white text-xs"
                                    style={{
                                        borderColor: form.primaryColor,
                                        boxShadow: `0 0 0 3px ${hexToRgba(form.primaryColor, 0.18)}`,
                                        color: '#374151',
                                    }}
                                >
                                    Input (odak)
                                </div>

                                {/* Checkbox */}
                                <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: '#374151' }}>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4"
                                        style={{ accentColor: form.primaryColor }}
                                        readOnly
                                    />
                                    Checkbox
                                </label>

                                {/* Icon badge (page header pattern used throughout admin) */}
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: hexToRgba(form.primaryColor, 0.1),
                                    }}
                                >
                                    <div
                                        className="w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: form.primaryColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Submit ─────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    {isSuccess && (
                        <span className="text-sm font-medium" style={{ color: settings.primaryColor }}>
                            Renkler kaydedildi.
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
