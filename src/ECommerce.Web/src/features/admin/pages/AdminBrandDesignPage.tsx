import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, X, Image, Store } from 'lucide-react';
import {
    getAdminStoreSettings,
    updateStoreSettings,
} from '../api/storeSettingsApi';
import type { StoreSettingsDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { useStoreSettings } from '@/context/StoreSettingsContext';

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
                        className="max-h-32 max-w-xs object-contain rounded-xl border border-border bg-gray-50 dark:bg-white/10 p-3"
                    />
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg text-xs font-semibold text-foreground hover:bg-accent transition-colors"
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
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-40 h-28 border-2 border-dashed border-border rounded-xl hover:border-[var(--primary)] hover:bg-accent transition-colors cursor-pointer"
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

export default function AdminBrandDesignPage() {
    const queryClient = useQueryClient();
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

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hexToRgba(settings.primaryColor, 0.1) }}
                >
                    <Store className="w-5 h-5" style={{ color: settings.primaryColor }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: settings.primaryColor }}>
                        Marka &amp; Logo
                    </h1>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        Mağaza adı ve logo ayarları
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
                style={{
                    '--primary': settings.primaryColor,
                    '--tw-ring-color': settings.primaryColor,
                    accentColor: settings.primaryColor,
                } as React.CSSProperties}
            >
                <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
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
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-background text-foreground"
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

            {/* ── Live Preview ── */}
            {form && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-border text-muted-foreground">
                        Canlı Önizleme — Header
                    </p>
                    <div
                        className="flex items-center gap-3 px-5 py-4"
                        style={{ backgroundColor: form.headerBackgroundColor }}
                    >
                        {form.imageBase64 ? (
                            <img src={form.imageBase64} alt="logo" className="h-8 object-contain" />
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
