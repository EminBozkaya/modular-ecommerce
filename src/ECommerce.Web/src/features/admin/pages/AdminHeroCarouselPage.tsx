import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow, EffectFlip } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import {
    ChevronDown,
    ChevronUp,
    Trash2,
    Plus,
    Save,
    Eye,
    ImageIcon,
    X,
} from 'lucide-react';
import { getAdminStoreSettings, updateStoreSettings } from '../api/storeSettingsApi';
import type { HeroCarouselDto, HeroSlideDto } from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';

// ── Helpers ──────────────────────────────────────────────────────────────────

function newSlide(): HeroSlideDto {
    return {
        id: crypto.randomUUID(),
        title: 'Yeni Slayt',
        subtitle: '',
        description: '',
        textColor: '#FFFFFF',
        overlayColor: '#2C3E50',
        overlayOpacity: 80,
        buttonText: 'Daha Fazla',
        buttonLink: '/products',
        buttonVisible: true,
    };
}

function hexToRgba(hex: string, opacity: number): string {
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${opacity / 100})`;
    } catch {
        return `rgba(0,0,0,${opacity / 100})`;
    }
}

// ── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[var(--brand-primary)]' : 'bg-gray-200'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
}

// ── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h3>
            {children}
        </div>
    );
}

// ── Label Row ────────────────────────────────────────────────────────────────

function LabelRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

// ── Effect Selector ──────────────────────────────────────────────────────────

type Effect = HeroCarouselDto['effect'];

const EFFECTS: { value: Effect; label: string }[] = [
    { value: 'slide', label: 'Slayt' },
    { value: 'fade', label: 'Solma' },
    { value: 'coverflow', label: 'Kapak Akışı' },
    { value: 'flip', label: 'Çevirme' },
];

function EffectSelector({ value, onChange }: { value: Effect; onChange: (v: Effect) => void }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {EFFECTS.map((e) => (
                <button
                    key={e.value}
                    type="button"
                    onClick={() => onChange(e.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${value === e.value
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {e.label}
                </button>
            ))}
        </div>
    );
}

// ── Color Input ──────────────────────────────────────────────────────────────

function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-sm text-gray-600">{label}</span>}
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={7}
                    className="w-20 text-xs font-mono outline-none bg-transparent text-gray-700"
                />
            </div>
        </div>
    );
}

// ── Slide Editor Card ────────────────────────────────────────────────────────

function SlideEditorCard({
    slide,
    index,
    total,
    onChange,
    onMoveUp,
    onMoveDown,
    onDelete,
}: {
    slide: HeroSlideDto;
    index: number;
    total: number;
    onChange: (updated: HeroSlideDto) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
}) {
    const [expanded, setExpanded] = useState(index === 0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const update = useCallback(
        <K extends keyof HeroSlideDto>(key: K, val: HeroSlideDto[K]) =>
            onChange({ ...slide, [key]: val }),
        [slide, onChange],
    );

    function handleImageUpload(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') update('imageBase64', result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer select-none"
                onClick={() => setExpanded((p) => !p)}
            >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                    {slide.title || 'Başlıksız Slayt'}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                        aria-label="Yukarı taşı"
                    >
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        disabled={index === total - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                        aria-label="Aşağı taşı"
                    >
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        disabled={total <= 1}
                        className="p-1 rounded hover:bg-red-100 disabled:opacity-30 transition-colors ml-1"
                        aria-label="Slaytı sil"
                    >
                        <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Body */}
            {expanded && (
                <div className="px-4 py-4 space-y-4 bg-white">
                    {/* Image */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Arka Plan Görseli</p>
                        <div className="flex gap-2 items-start">
                            <div
                                className="w-20 h-14 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden"
                                style={{
                                    background: slide.imageBase64 || slide.imageUrl
                                        ? undefined
                                        : hexToRgba(slide.overlayColor, slide.overlayOpacity / 100 + 0.1),
                                }}
                            >
                                {slide.imageBase64 ? (
                                    <img src={slide.imageBase64} alt="" className="w-full h-full object-cover" />
                                ) : slide.imageUrl ? (
                                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-white/60" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleImageUpload(f);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Görsel Yükle
                                </button>
                                {(slide.imageBase64 ?? slide.imageUrl) && (
                                    <button
                                        type="button"
                                        onClick={() => { update('imageBase64', undefined); update('imageUrl', undefined); }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Kaldır
                                    </button>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">veya URL girin</p>
                                    <input
                                        type="url"
                                        value={slide.imageUrl ?? ''}
                                        onChange={(e) => { update('imageUrl', e.target.value || undefined); update('imageBase64', undefined); }}
                                        placeholder="https://..."
                                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[var(--brand-primary)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İçerik</p>
                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => update('title', e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)]"
                                    placeholder="Ana başlık"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Alt Başlık</label>
                                <input
                                    type="text"
                                    value={slide.subtitle}
                                    onChange={(e) => update('subtitle', e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)]"
                                    placeholder="Alt başlık"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Açıklama</label>
                                <textarea
                                    value={slide.description}
                                    onChange={(e) => update('description', e.target.value)}
                                    rows={2}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)] resize-none"
                                    placeholder="Kısa açıklama metni"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Renkler</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Metin Rengi</span>
                                <ColorInput value={slide.textColor} onChange={(v) => update('textColor', v)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Kaplama Rengi</span>
                                <ColorInput value={slide.overlayColor} onChange={(v) => update('overlayColor', v)} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-600">Kaplama Opaklığı</span>
                                    <span className="text-sm font-medium text-gray-800">{slide.overlayOpacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={slide.overlayOpacity}
                                    onChange={(e) => update('overlayOpacity', Number(e.target.value))}
                                    className="w-full accent-[var(--brand-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buton</p>
                            <Toggle
                                checked={slide.buttonVisible}
                                onChange={(v) => update('buttonVisible', v)}
                            />
                        </div>
                        {slide.buttonVisible && (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Buton Metni</label>
                                    <input
                                        type="text"
                                        value={slide.buttonText}
                                        onChange={(e) => update('buttonText', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)]"
                                        placeholder="Buton yazısı"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Buton Linki</label>
                                    <input
                                        type="text"
                                        value={slide.buttonLink}
                                        onChange={(e) => update('buttonLink', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)]"
                                        placeholder="/products"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Mini Preview Slide ───────────────────────────────────────────────────────

function PreviewSlide({ slide, height }: { slide: HeroSlideDto; height: number }) {
    const hasImage = slide.imageBase64 ?? slide.imageUrl;
    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            {slide.imageBase64 ? (
                <img src={slide.imageBase64} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : slide.imageUrl ? (
                <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
                <div className="absolute inset-0" style={{ backgroundColor: slide.overlayColor }} />
            )}
            {hasImage && (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: hexToRgba(slide.overlayColor, slide.overlayOpacity) }}
                />
            )}
            <div className="relative h-full flex items-center px-8" style={{ color: slide.textColor }}>
                <div className="max-w-[60%]">
                    {slide.title && (
                        <h2 className="text-xl font-serif font-bold leading-tight mb-1">{slide.title}</h2>
                    )}
                    {slide.subtitle && (
                        <p className="text-sm mb-2 opacity-90">{slide.subtitle}</p>
                    )}
                    {slide.description && (
                        <p className="text-xs opacity-80 mb-3 line-clamp-2">{slide.description}</p>
                    )}
                    {slide.buttonVisible && slide.buttonText && (
                        <span
                            className="inline-block px-4 py-1.5 text-xs font-semibold rounded-md text-white"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                            {slide.buttonText}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AdminHeroCarouselPage() {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: queryKeys.store.settings,
        queryFn: getAdminStoreSettings,
        staleTime: 5 * 60 * 1000,
    });

    const [draft, setDraft] = useState<HeroCarouselDto | null>(null);

    // Initialise draft when settings load
    useEffect(() => {
        if (settings && !draft) {
            setDraft(structuredClone(settings.heroCarousel));
        }
    }, [settings, draft]);

    const mutation = useMutation({
        mutationFn: async (carousel: HeroCarouselDto) => {
            if (!settings) return;
            await updateStoreSettings({ ...settings, heroCarousel: carousel });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.store.settings });
        },
    });

    // ── draft helpers ────────────────────────────────────────────────────────

    function updateDraft<K extends keyof HeroCarouselDto>(key: K, value: HeroCarouselDto[K]) {
        setDraft((prev) => prev ? { ...prev, [key]: value } : prev);
    }

    function updateSlide(index: number, updated: HeroSlideDto) {
        setDraft((prev) => {
            if (!prev) return prev;
            const slides = [...prev.slides];
            slides[index] = updated;
            return { ...prev, slides };
        });
    }

    function addSlide() {
        setDraft((prev) => {
            if (!prev || prev.slides.length >= 8) return prev;
            return { ...prev, slides: [...prev.slides, newSlide()] };
        });
    }

    function deleteSlide(index: number) {
        setDraft((prev) => {
            if (!prev || prev.slides.length <= 1) return prev;
            const slides = prev.slides.filter((_, i) => i !== index);
            return { ...prev, slides };
        });
    }

    function moveSlide(index: number, direction: 'up' | 'down') {
        setDraft((prev) => {
            if (!prev) return prev;
            const slides = [...prev.slides];
            const target = direction === 'up' ? index - 1 : index + 1;
            if (target < 0 || target >= slides.length) return prev;
            [slides[index], slides[target]] = [slides[target], slides[index]];
            return { ...prev, slides };
        });
    }

    // ── Swiper modules for preview ───────────────────────────────────────────
    const previewModules = (() => {
        const mods = [Navigation, Pagination, Autoplay];
        if (draft?.effect === 'fade') mods.push(EffectFade);
        if (draft?.effect === 'coverflow') mods.push(EffectCoverflow);
        if (draft?.effect === 'flip') mods.push(EffectFlip);
        return mods;
    })();

    // ── Render ───────────────────────────────────────────────────────────────

    if (isLoading || !draft) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Yükleniyor…
            </div>
        );
    }

    const PREVIEW_HEIGHT = Math.round(draft.height * 0.55);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Hero Karosel</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Ana sayfanın üst kısmında gösterilen karosel slaytlarını yönetin
                    </p>
                </div>
                <button
                    type="button"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(draft)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                    <Save className="h-4 w-4" />
                    {mutation.isPending ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {mutation.isSuccess && (
                <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    ✓ Değişiklikler başarıyla kaydedildi.
                </div>
            )}

            {mutation.isError && (
                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    Kaydedilemedi. Lütfen tekrar deneyin.
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ── Left column: settings ──────────────────────────────── */}
                <div className="space-y-0">

                    {/* Global settings */}
                    <SectionCard title="Genel Ayarlar">
                        <div className="divide-y divide-gray-50">
                            <LabelRow
                                label="Karosel Aktif"
                                description="Kapatınca ana sayfada karosel görünmez"
                            >
                                <Toggle checked={draft.enabled} onChange={(v) => updateDraft('enabled', v)} />
                            </LabelRow>

                            <div className="py-3">
                                <p className="text-sm font-medium text-gray-800 mb-2">Geçiş Efekti</p>
                                <EffectSelector
                                    value={draft.effect}
                                    onChange={(v) => updateDraft('effect', v)}
                                />
                            </div>

                            <div className="py-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-800">Karosel Yüksekliği</p>
                                    <span className="text-sm font-medium text-gray-700">{draft.height} px</span>
                                </div>
                                <input
                                    type="range"
                                    min={300}
                                    max={800}
                                    step={10}
                                    value={draft.height}
                                    onChange={(e) => updateDraft('height', Number(e.target.value))}
                                    className="w-full accent-[var(--brand-primary)]"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                    <span>300 px</span>
                                    <span>800 px</span>
                                </div>
                            </div>

                            <LabelRow label="Otomatik Oynatma" description="Slaytlar otomatik geçer">
                                <Toggle checked={draft.autoPlay} onChange={(v) => updateDraft('autoPlay', v)} />
                            </LabelRow>

                            {draft.autoPlay && (
                                <div className="py-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">Geçiş Süresi</p>
                                        <span className="text-sm font-medium text-gray-700">
                                            {(draft.autoPlayInterval / 1000).toFixed(1)} sn
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={2000}
                                        max={12000}
                                        step={500}
                                        value={draft.autoPlayInterval}
                                        onChange={(e) => updateDraft('autoPlayInterval', Number(e.target.value))}
                                        className="w-full accent-[var(--brand-primary)]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                        <span>2 sn</span>
                                        <span>12 sn</span>
                                    </div>
                                </div>
                            )}

                            <LabelRow label="Döngü" description="Son slayttan sonra başa döner">
                                <Toggle checked={draft.loop} onChange={(v) => updateDraft('loop', v)} />
                            </LabelRow>

                            <LabelRow label="Ok Düğmeleri" description="Sol/sağ gezinme okları">
                                <Toggle checked={draft.showArrows} onChange={(v) => updateDraft('showArrows', v)} />
                            </LabelRow>

                            <LabelRow label="Nokta Göstergesi" description="Alt kısmındaki slayt noktaları">
                                <Toggle checked={draft.showDots} onChange={(v) => updateDraft('showDots', v)} />
                            </LabelRow>
                        </div>
                    </SectionCard>

                    {/* Slides */}
                    <SectionCard title={`Slaytlar (${draft.slides.length}/8)`}>
                        {draft.slides.map((slide, index) => (
                            <SlideEditorCard
                                key={slide.id}
                                slide={slide}
                                index={index}
                                total={draft.slides.length}
                                onChange={(updated) => updateSlide(index, updated)}
                                onMoveUp={() => moveSlide(index, 'up')}
                                onMoveDown={() => moveSlide(index, 'down')}
                                onDelete={() => deleteSlide(index)}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={addSlide}
                            disabled={draft.slides.length >= 8}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="h-4 w-4" />
                            Slayt Ekle
                        </button>
                    </SectionCard>
                </div>

                {/* ── Right column: live preview ──────────────────────────── */}
                <div className="xl:sticky xl:top-6 self-start">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4 text-[var(--brand-primary)]" />
                            <h3 className="text-base font-semibold text-gray-900">Canlı Önizleme</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">
                            Değişiklikler kaydedilene kadar siteye yansımaz.
                        </p>

                        {/* Preview carousel */}
                        {draft.enabled && draft.slides.length > 0 ? (
                            <div
                                className="rounded-lg overflow-hidden border border-gray-100"
                                style={{ height: PREVIEW_HEIGHT }}
                            >
                                <Swiper
                                    key={`${draft.effect}-${draft.slides.length}`}
                                    modules={previewModules}
                                    effect={draft.effect}
                                    loop={draft.loop && draft.slides.length > 1}
                                    autoplay={
                                        draft.autoPlay
                                            ? { delay: draft.autoPlayInterval, disableOnInteraction: false }
                                            : false
                                    }
                                    navigation={draft.showArrows}
                                    pagination={draft.showDots ? { clickable: true } : false}
                                    className="h-full w-full"
                                    style={{ height: PREVIEW_HEIGHT }}
                                    coverflowEffect={
                                        draft.effect === 'coverflow'
                                            ? { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }
                                            : undefined
                                    }
                                >
                                    {draft.slides.map((slide) => (
                                        <SwiperSlide key={slide.id} style={{ height: PREVIEW_HEIGHT }}>
                                            <PreviewSlide slide={slide} height={PREVIEW_HEIGHT} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            <div
                                className="rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm gap-2"
                                style={{ height: PREVIEW_HEIGHT }}
                            >
                                <Eye className="h-8 w-8 opacity-30" />
                                <span>Karosel devre dışı</span>
                            </div>
                        )}

                        <p className="text-xs text-gray-400 mt-3 text-center">
                            Önizleme yaklaşık %55 ölçeğinde gösterilmektedir
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
