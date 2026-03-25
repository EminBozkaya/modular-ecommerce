import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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
import { getAdminStoreSettings, updateStoreSettings, getLocalizedText } from '../api/storeSettingsApi';
import type { HeroCarouselDto, HeroSlideDto } from '../api/storeSettingsApi';
import { TranslatableInput } from '../components/TranslatableInput';
import { queryKeys } from '@/utils/queryKeys';

// ── Helpers ──────────────────────────────────────────────────────────────────

function newSlide(t: TFunction): HeroSlideDto {
    return {
        id: crypto.randomUUID(),
        title: t('design.hero.slideTitle'),
        subtitle: '',
        description: '',
        textColor: '#FFFFFF',
        overlayColor: '#2C3E50',
        overlayOpacity: 80,
        buttonText: t('design.hero.defaultButtonText'),
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[var(--brand-primary)]' : 'bg-gray-200 dark:bg-white/20'}`}
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
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 mb-4">
            <h3 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">{title}</h3>
            {children}
        </div>
    );
}

// ── Label Row ────────────────────────────────────────────────────────────────

function LabelRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

// ── Effect Selector ──────────────────────────────────────────────────────────

type Effect = HeroCarouselDto['effect'];

function getEffects(t: TFunction): { value: Effect; label: string }[] {
    return [
        { value: 'slide', label: t('design.hero.effects.slide') },
        { value: 'fade', label: t('design.hero.effects.fade') },
        { value: 'coverflow', label: t('design.hero.effects.coverFlow') },
        { value: 'flip', label: t('design.hero.effects.flip') },
    ];
}

function EffectSelector({ value, onChange, t }: { value: Effect; onChange: (v: Effect) => void; t: TFunction }) {
    const effects = getEffects(t);
    return (
        <div className="flex gap-2 flex-wrap">
            {effects.map((e) => (
                <button
                    key={e.value}
                    type="button"
                    onClick={() => onChange(e.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${value === e.value
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-accent text-muted-foreground hover:bg-accent/80'
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
            {label && <span className="text-sm text-muted-foreground">{label}</span>}
            <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 py-1 bg-background">
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
                    className="w-20 text-xs font-mono outline-none bg-transparent text-foreground"
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
    t,
}: {
    slide: HeroSlideDto;
    index: number;
    total: number;
    onChange: (updated: HeroSlideDto) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    t: TFunction;
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

    const updateTranslation = (lang: string, field: string, val: string) => {
        const newTranslations = JSON.parse(JSON.stringify(slide.translations || {}));
        if (!newTranslations[lang]) newTranslations[lang] = {};
        newTranslations[lang][field] = val;
        update('translations', newTranslations);
    };

    return (
        <div className="border border-border rounded-xl overflow-hidden mb-3">
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 cursor-pointer select-none"
                onClick={() => setExpanded((p) => !p)}
            >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {slide.title || t('design.hero.slideTitle')}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                        aria-label={t('design.common.moveUp')}
                    >
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        disabled={index === total - 1}
                        className="p-1 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                        aria-label={t('design.common.moveDown')}
                    >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        disabled={total <= 1}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-30 transition-colors ml-1"
                        aria-label={t('design.hero.deleteSlide')}
                    >
                        <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                    <ChevronDown
                        className={`h-4 w-4 text-muted-foreground ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Body */}
            {expanded && (
                <div className="px-4 py-4 space-y-4 bg-card">
                    {/* Image */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('design.hero.bgImage')}</p>
                        <div className="flex gap-2 items-start">
                            <div
                                className="w-20 h-14 rounded-lg border border-border flex items-center justify-center flex-shrink-0 overflow-hidden"
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-accent transition-colors text-foreground"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    {t('design.common.uploadImage')}
                                </button>
                                {(slide.imageBase64 ?? slide.imageUrl) && (
                                    <button
                                        type="button"
                                        onClick={() => { update('imageBase64', undefined); update('imageUrl', undefined); }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        {t('design.common.remove')}
                                    </button>
                                )}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t('design.common.orEnterUrl')}</p>
                                    <input
                                        type="url"
                                        value={slide.imageUrl ?? ''}
                                        onChange={(e) => { update('imageUrl', e.target.value || undefined); update('imageBase64', undefined); }}
                                        placeholder="https://..."
                                        className="w-full text-xs border border-border rounded-lg px-3 py-1.5 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('design.hero.content')}</p>
                        <div className="space-y-4">
                            <TranslatableInput
                                value={slide.title}
                                onChange={(v) => update('title', v)}
                                translations={slide.translations}
                                field="title"
                                onTranslationChange={updateTranslation}
                                label={t('design.hero.titleLabel')}
                                placeholder={t('design.hero.titlePlaceholder')}
                            />
                            <TranslatableInput
                                value={slide.subtitle}
                                onChange={(v) => update('subtitle', v)}
                                translations={slide.translations}
                                field="subtitle"
                                onTranslationChange={updateTranslation}
                                label={t('design.hero.subtitleLabel')}
                                placeholder={t('design.hero.subtitleLabel')}
                            />
                            <TranslatableInput
                                value={slide.description}
                                onChange={(v) => update('description', v)}
                                translations={slide.translations}
                                field="description"
                                onTranslationChange={updateTranslation}
                                label={t('design.hero.descLabel')}
                                placeholder={t('design.hero.descLabel')}
                                textarea
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('design.hero.colors')}</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{t('design.hero.textColor')}</span>
                                <ColorInput value={slide.textColor} onChange={(v) => update('textColor', v)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{t('design.hero.overlayColor')}</span>
                                <ColorInput value={slide.overlayColor} onChange={(v) => update('overlayColor', v)} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-muted-foreground">{t('design.hero.overlayOpacity')}</span>
                                    <span className="text-sm font-medium text-foreground">{slide.overlayOpacity}%</span>
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
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('design.hero.button')}</p>
                            <Toggle
                                checked={slide.buttonVisible}
                                onChange={(v) => update('buttonVisible', v)}
                            />
                        </div>
                        {slide.buttonVisible && (
                            <div className="space-y-4 mt-3">
                                <TranslatableInput
                                    value={slide.buttonText}
                                    onChange={(v) => update('buttonText', v)}
                                    translations={slide.translations}
                                    field="buttonText"
                                    onTranslationChange={updateTranslation}
                                    label={t('design.hero.buttonText')}
                                    placeholder={t('design.hero.buttonTextPlaceholder')}
                                />
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">{t('design.hero.buttonLink')}</label>
                                    <input
                                        type="text"
                                        value={slide.buttonLink}
                                        onChange={(e) => update('buttonLink', e.target.value)}
                                        className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground"
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

function PreviewSlide({ slide, height, lang }: { slide: HeroSlideDto; height: number; lang: string }) {
    const hasImage = slide.imageBase64 ?? slide.imageUrl;
    
    const title = getLocalizedText(slide, 'title', lang);
    const subtitle = getLocalizedText(slide, 'subtitle', lang);
    const description = getLocalizedText(slide, 'description', lang);
    const buttonText = getLocalizedText(slide, 'buttonText', lang);

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
                    {title && (
                        <h2 className="text-xl font-serif font-bold leading-tight mb-1">{title}</h2>
                    )}
                    {subtitle && (
                        <p className="text-sm mb-2 opacity-90">{subtitle}</p>
                    )}
                    {description && (
                        <p className="text-xs opacity-80 mb-3 line-clamp-2">{description}</p>
                    )}
                    {slide.buttonVisible && buttonText && (
                        <span
                            className="inline-block px-4 py-1.5 text-xs font-semibold rounded-md text-white"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                            {buttonText}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AdminHeroCarouselPage() {
    const { t, i18n } = useTranslation('admin');
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
            return { ...prev, slides: [...prev.slides, newSlide(t)] };
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
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                {t('design.common.loading')}
            </div>
        );
    }

    const PREVIEW_HEIGHT = Math.round(draft.height * 0.55);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-foreground">{t('design.hero.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {t('design.hero.subtitle')}
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
                    {mutation.isPending ? t('design.common.saving') : t('design.common.saveChanges')}
                </button>
            </div>

            {mutation.isSuccess && (
                <div className="mb-4 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg text-sm">
                    {t('design.common.saveSuccess')}
                </div>
            )}

            {mutation.isError && (
                <div className="mb-4 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {t('design.common.saveError')}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ── Left column: settings ──────────────────────────────── */}
                <div className="space-y-0">

                    {/* Global settings */}
                    <SectionCard title={t('design.hero.generalSettings')}>
                        <div className="divide-y divide-border/50">
                            <LabelRow
                                label={t('design.hero.carouselActive')}
                                description={t('design.hero.carouselActiveDesc')}
                            >
                                <Toggle checked={draft.enabled} onChange={(v) => updateDraft('enabled', v)} />
                            </LabelRow>

                            <div className="py-3">
                                <p className="text-sm font-medium text-foreground mb-2">{t('design.hero.transition')}</p>
                                <EffectSelector
                                    value={draft.effect}
                                    onChange={(v) => updateDraft('effect', v)}
                                    t={t}
                                />
                            </div>

                            <div className="py-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-foreground">{t('design.hero.height')}</p>
                                    <span className="text-sm font-medium text-foreground">{draft.height} px</span>
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
                                <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                                    <span>{t('design.hero.heightMin')}</span>
                                    <span>{t('design.hero.heightMax')}</span>
                                </div>
                            </div>

                            <LabelRow label={t('design.hero.autoplay')} description={t('design.hero.autoplayDesc')}>
                                <Toggle checked={draft.autoPlay} onChange={(v) => updateDraft('autoPlay', v)} />
                            </LabelRow>

                            {draft.autoPlay && (
                                <div className="py-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-foreground">{t('design.hero.interval')}</p>
                                        <span className="text-sm font-medium text-foreground">
                                            {(draft.autoPlayInterval / 1000).toFixed(1)} s
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
                                    <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                                        <span>{t('design.hero.intervalMin')}</span>
                                        <span>{t('design.hero.intervalMax')}</span>
                                    </div>
                                </div>
                            )}

                            <LabelRow label={t('design.hero.loop')} description={t('design.hero.loopDesc')}>
                                <Toggle checked={draft.loop} onChange={(v) => updateDraft('loop', v)} />
                            </LabelRow>

                            <LabelRow label={t('design.hero.arrows')} description={t('design.hero.arrowsDesc')}>
                                <Toggle checked={draft.showArrows} onChange={(v) => updateDraft('showArrows', v)} />
                            </LabelRow>

                            <LabelRow label={t('design.hero.dots')} description={t('design.hero.dotsDesc')}>
                                <Toggle checked={draft.showDots} onChange={(v) => updateDraft('showDots', v)} />
                            </LabelRow>
                        </div>
                    </SectionCard>

                    {/* Slides */}
                    <SectionCard title={t('design.hero.slides', { count: draft.slides.length })}>
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
                                t={t}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={addSlide}
                            disabled={draft.slides.length >= 8}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="h-4 w-4" />
                            {t('design.hero.addSlide')}
                        </button>
                    </SectionCard>
                </div>

                {/* ── Right column: live preview ──────────────────────────── */}
                <div className="xl:sticky xl:top-6 self-start">
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4 text-[var(--brand-primary)]" />
                            <h3 className="text-base font-semibold text-foreground">{t('design.common.preview')}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            {t('design.common.previewNote')}
                        </p>

                        {/* Preview carousel */}
                        {draft.enabled && draft.slides.length > 0 ? (
                            <div
                                className="rounded-lg overflow-hidden border border-border"
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
                                            <PreviewSlide slide={slide} height={PREVIEW_HEIGHT} lang={i18n.language} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            <div
                                className="rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-sm gap-2"
                                style={{ height: PREVIEW_HEIGHT }}
                            >
                                <Eye className="h-8 w-8 opacity-30" />
                                <span>{t('design.hero.carouselDisabled')}</span>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            {t('design.common.previewScale')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
