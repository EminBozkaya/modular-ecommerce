import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Save,
    Eye,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    ImageIcon,
    X,
    LayoutGrid,
    Star,
    Image as ImageLucide,
    GalleryHorizontalEnd,
    Columns3,
    Clover,
    LayoutDashboard,
} from 'lucide-react';
import {
    getAdminStoreSettings,
    updateStoreSettings,
    defaultHomepageSections,
} from '../api/storeSettingsApi';
import type {
    HomepageSectionDto,
    SectionCardDto,
    SectionLayout,
    TextPosition,
    BadgePosition,
    LinkType,
    AspectRatio,
} from '../api/storeSettingsApi';
import { HomepageSections } from '../../catalog/components/HomepageSections';
import { queryKeys } from '@/utils/queryKeys';
// ── Helpers ──────────────────────────────────────────────────────────────────

function newCard(t: TFunction): SectionCardDto {
    return {
        id: crypto.randomUUID(),
        title: t('design.showcase.defaultCardTitle'),
        subtitle: '',
        description: '',
        textPosition: 'center',
        textColor: '#FFFFFF',
        overlayColor: '#000000',
        overlayOpacity: 30,
        badgePosition: 'top-left',
        linkType: 'none',
        buttonVisible: false,
        aspectRatio: 'landscape',
        colSpan: 1,
        rowSpan: 1,
    };
}

function newSection(layout: SectionLayout, t: TFunction): HomepageSectionDto {
    return {
        id: crypto.randomUUID(),
        title: t('design.showcase.defaultSectionTitle'),
        showTitle: true,
        layout,
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 48,
        order: 0,
        enabled: true,
        cards: [newCard(t)],
    };
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
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

// ── Color Input ──────────────────────────────────────────────────────────────

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 py-1 bg-background">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={7} className="w-20 text-xs font-mono outline-none bg-transparent text-foreground" />
        </div>
    );
}

// ── Layout Selector ──────────────────────────────────────────────────────────

const LAYOUT_ICONS: Record<SectionLayout, React.ElementType> = {
    grid: LayoutGrid,
    featured: Star,
    banner: ImageLucide,
    carousel: GalleryHorizontalEnd,
    masonry: Columns3,
    clover: Clover,
    collage: LayoutDashboard,
};

function getLayouts(t: TFunction): { value: SectionLayout; label: string; icon: React.ElementType }[] {
    return [
        { value: 'grid', label: t('design.showcase.layouts.grid'), icon: LayoutGrid },
        { value: 'featured', label: t('design.showcase.layouts.featured'), icon: Star },
        { value: 'banner', label: t('design.showcase.layouts.banner'), icon: ImageLucide },
        { value: 'carousel', label: t('design.showcase.layouts.scrollable'), icon: GalleryHorizontalEnd },
        { value: 'masonry', label: t('design.showcase.layouts.mosaic'), icon: Columns3 },
        { value: 'clover', label: t('design.showcase.layouts.clover'), icon: Clover },
        { value: 'collage', label: t('design.showcase.layouts.collage'), icon: LayoutDashboard },
    ];
}

function LayoutSelector({ value, onChange, t }: { value: SectionLayout; onChange: (v: SectionLayout) => void; t: TFunction }) {
    const layouts = getLayouts(t);
    return (
        <div className="flex gap-1.5 flex-wrap">
            {layouts.map((l) => {
                const Icon = l.icon;
                return (
                    <button
                        key={l.value}
                        type="button"
                        onClick={() => onChange(l.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${value === l.value ? 'bg-[var(--brand-primary)] text-white' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {l.label}
                    </button>
                );
            })}
        </div>
    );
}

// ── Card Editor ──────────────────────────────────────────────────────────────

function CardEditor({
    card,
    index,
    total,
    sectionLayout,
    onChange,
    onDelete,
    t,
}: {
    card: SectionCardDto;
    index: number;
    total: number;
    sectionLayout: SectionLayout;
    onChange: (card: SectionCardDto) => void;
    onDelete: () => void;
    t: TFunction;
}) {
    const [expanded, setExpanded] = useState(false);

    const set = <K extends keyof SectionCardDto>(key: K, val: SectionCardDto[K]) =>
        onChange({ ...card, [key]: val });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => set('imageBase64', reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="border border-border rounded-lg bg-gray-50 dark:bg-white/5 mb-2">
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <span className="w-5 h-5 rounded-full bg-accent text-xs flex items-center justify-center font-medium text-muted-foreground">{index + 1}</span>
                <span className="text-sm font-medium text-foreground flex-1 truncate">{card.title || t('design.showcase.cardFallback')}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }} disabled={total <= 0} className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
                {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>

            {expanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                    {/* Image */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('design.showcase.imageLabel')}</label>
                        <div className="flex gap-2">
                            <label className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-dashed border-border cursor-pointer hover:bg-accent text-muted-foreground">
                                <ImageIcon className="h-3.5 w-3.5" /> {t('design.common.uploadImage')}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                            {(card.imageBase64 || card.imageUrl) && (
                                <button type="button" onClick={() => { set('imageBase64', undefined); set('imageUrl', undefined); }} className="text-xs text-red-400 hover:text-red-600">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <input type="text" value={card.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value || undefined)} placeholder={t('design.showcase.urlPlaceholder')} className="mt-1 w-full text-xs border border-border rounded px-2 py-1 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground" />
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 gap-2">
                        <input type="text" value={card.title} onChange={(e) => set('title', e.target.value)} placeholder={t('design.showcase.titleLabel')} className="text-sm border border-border rounded px-2 py-1 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground" />
                        <input type="text" value={card.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder={t('design.showcase.subtitleLabel')} className="text-sm border border-border rounded px-2 py-1 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground" />
                        <textarea value={card.description} onChange={(e) => set('description', e.target.value)} placeholder={t('design.showcase.descLabel')} rows={2} className="text-sm border border-border rounded px-2 py-1 outline-none focus:border-[var(--brand-primary)] resize-none bg-background text-foreground" />
                    </div>

                    {/* Appearance */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">{t('design.showcase.textPosition')}</label>
                            <select value={card.textPosition} onChange={(e) => set('textPosition', e.target.value as TextPosition)} className="mt-0.5 w-full text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                                <option value="top-left">{t('design.showcase.positions.topLeft')}</option>
                                <option value="top-right">{t('design.showcase.positions.topLeft')}</option>
                                <option value="center">{t('design.showcase.positions.center')}</option>
                                <option value="bottom-left">{t('design.showcase.positions.bottomLeft')}</option>
                                <option value="bottom-right">{t('design.showcase.positions.bottomLeft')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">{t('design.showcase.aspectRatio')}</label>
                            <select value={card.aspectRatio} onChange={(e) => set('aspectRatio', e.target.value as AspectRatio)} className="mt-0.5 w-full text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                                <option value="landscape">{t('design.showcase.ratios.landscape')}</option>
                                <option value="square">{t('design.showcase.ratios.square')}</option>
                                <option value="portrait">{t('design.showcase.ratios.portrait')}</option>
                                <option value="auto">{t('design.showcase.ratios.auto')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <label className="text-xs text-muted-foreground block mb-0.5">{t('design.hero.textColor')}</label>
                            <ColorInput value={card.textColor} onChange={(v) => set('textColor', v)} />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground block mb-0.5">{t('design.hero.overlayColor')}</label>
                            <ColorInput value={card.overlayColor} onChange={(v) => set('overlayColor', v)} />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground block mb-0.5">{t('design.hero.overlayOpacity')}</label>
                            <input type="range" min={0} max={100} value={card.overlayOpacity} onChange={(e) => set('overlayOpacity', Number(e.target.value))} className="w-20 accent-[var(--brand-primary)]" />
                            <span className="text-xs text-muted-foreground ml-1">%{card.overlayOpacity}</span>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <input type="text" value={card.badgeText || ''} onChange={(e) => set('badgeText', e.target.value || undefined)} placeholder={t('design.showcase.badgePlaceholder')} className="text-xs border border-border rounded px-2 py-1 w-28 outline-none bg-background text-foreground" />
                        {card.badgeText && (
                            <>
                                <ColorInput value={card.badgeColor || '#D4A853'} onChange={(v) => set('badgeColor', v)} />
                                <select value={card.badgePosition} onChange={(e) => set('badgePosition', e.target.value as BadgePosition)} className="text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                                    <option value="top-left">{t('design.showcase.positions.topLeft')}</option>
                                    <option value="top-right">{t('design.showcase.positions.topLeft')}</option>
                                </select>
                            </>
                        )}
                    </div>

                    {/* Link */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <select value={card.linkType} onChange={(e) => set('linkType', e.target.value as LinkType)} className="text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                            <option value="none">{t('design.showcase.linkTypes.none')}</option>
                            <option value="url">{t('design.showcase.linkTypes.url')}</option>
                            <option value="product">{t('design.showcase.linkTypes.productId')}</option>
                            <option value="category">{t('design.showcase.linkTypes.categoryId')}</option>
                        </select>
                        {card.linkType !== 'none' && (
                            <input type="text" value={card.linkTarget || ''} onChange={(e) => set('linkTarget', e.target.value || undefined)} placeholder={card.linkType === 'url' ? '/products' : 'ID'} className="text-xs border border-border rounded px-2 py-1 flex-1 outline-none bg-background text-foreground" />
                        )}
                    </div>

                    {/* Button */}
                    <div className="flex items-center gap-3">
                        <Toggle checked={card.buttonVisible} onChange={(v) => set('buttonVisible', v)} />
                        <span className="text-xs text-muted-foreground">{t('design.showcase.showButton')}</span>
                        {card.buttonVisible && (
                            <input type="text" value={card.buttonText || ''} onChange={(e) => set('buttonText', e.target.value || undefined)} placeholder={t('design.showcase.buttonText')} className="text-xs border border-border rounded px-2 py-1 flex-1 outline-none bg-background text-foreground" />
                        )}
                    </div>

                    {/* Collage span */}
                    {sectionLayout === 'collage' && (
                        <div className="flex items-center gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground">{t('design.showcase.colWidth')}</label>
                                <select value={card.colSpan} onChange={(e) => set('colSpan', Number(e.target.value))} className="ml-1 text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">{t('design.showcase.rowHeight')}</label>
                                <select value={card.rowSpan} onChange={(e) => set('rowSpan', Number(e.target.value))} className="ml-1 text-xs border border-border rounded px-2 py-1 outline-none bg-background text-foreground">
                                    {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Sortable Section ─────────────────────────────────────────────────────────

function SortableSectionCard({
    section,
    index,
    total,
    onChange,
    onDelete,
    t,
}: {
    section: HomepageSectionDto;
    index: number;
    total: number;
    onChange: (s: HomepageSectionDto) => void;
    onDelete: () => void;
    t: TFunction;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
    const [expanded, setExpanded] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        opacity: isDragging ? 0.85 : 1,
    };

    const set = <K extends keyof HomepageSectionDto>(key: K, val: HomepageSectionDto[K]) =>
        onChange({ ...section, [key]: val });

    const updateCard = (cardIndex: number, card: SectionCardDto) => {
        const cards = [...section.cards];
        cards[cardIndex] = card;
        set('cards', cards);
    };

    const deleteCard = (cardIndex: number) => {
        set('cards', section.cards.filter((_, i) => i !== cardIndex));
    };

    const addCard = () => {
        set('cards', [...section.cards, newCard(t)]);
    };

    return (
        <div ref={setNodeRef} style={style} className={`bg-card rounded-xl border mb-3 transition-shadow ${isDragging ? 'shadow-lg border-[var(--brand-primary)]' : 'border-border shadow-sm'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3">
                <button type="button" {...attributes} {...listeners} className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent text-muted-foreground touch-none">
                    <GripVertical className="h-5 w-5" />
                </button>
                <span className="w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white text-xs flex items-center justify-center font-bold">{index + 1}</span>
                <span className="text-sm font-medium text-foreground flex-1 truncate">{section.title || t('design.showcase.sectionFallback')}</span>
                <Toggle checked={section.enabled} onChange={(v) => set('enabled', v)} />
                <button type="button" onClick={onDelete} disabled={total <= 1} className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setExpanded(!expanded)} className="p-1 text-muted-foreground hover:text-foreground">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
            </div>

            {/* Body */}
            {expanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <input type="text" value={section.title} onChange={(e) => set('title', e.target.value)} placeholder={t('design.showcase.sectionTitle')} className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 outline-none focus:border-[var(--brand-primary)] bg-background text-foreground" />
                        <div className="flex items-center gap-2">
                            <Toggle checked={section.showTitle} onChange={(v) => set('showTitle', v)} />
                            <span className="text-xs text-muted-foreground">{t('design.showcase.showTitle')}</span>
                        </div>
                    </div>

                    {/* Layout */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('design.showcase.layoutType')}</label>
                        <LayoutSelector value={section.layout} onChange={(v) => set('layout', v)} t={t} />
                    </div>

                    {/* Columns — only for grid/masonry */}
                    {(section.layout === 'grid' || section.layout === 'masonry') && (
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('design.showcase.columnCount')}</label>
                            <div className="flex gap-2">
                                {[2, 3, 4].map((n) => (
                                    <button key={n} type="button" onClick={() => set('columns', n)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${section.columns === n ? 'bg-[var(--brand-primary)] text-white' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Background + Padding */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <label className="text-xs text-muted-foreground block mb-0.5">{t('design.showcase.background')}</label>
                            <ColorInput value={section.backgroundColor === 'transparent' ? '#ffffff' : section.backgroundColor} onChange={(v) => set('backgroundColor', v)} />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground block mb-0.5">{t('design.showcase.verticalPadding')}</label>
                            <div className="flex items-center gap-1">
                                <input type="range" min={0} max={120} value={section.paddingY} onChange={(e) => set('paddingY', Number(e.target.value))} className="w-24 accent-[var(--brand-primary)]" />
                                <span className="text-xs text-muted-foreground w-8">{section.paddingY}px</span>
                            </div>
                        </div>
                    </div>

                    {/* Cards */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">{t('design.showcase.cards', { count: section.cards.length })}</label>
                        {section.cards.map((card, ci) => (
                            <CardEditor
                                key={card.id}
                                card={card}
                                index={ci}
                                total={section.cards.length}
                                sectionLayout={section.layout}
                                onChange={(c) => updateCard(ci, c)}
                                onDelete={() => deleteCard(ci)}
                                t={t}
                            />
                        ))}
                        <button type="button" onClick={addCard} className="w-full mt-1 py-2 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:bg-accent hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-center gap-1">
                            <Plus className="h-3.5 w-3.5" /> {t('design.showcase.addCard')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export default function AdminShowcasePage() {
    const { t, i18n } = useTranslation('admin');
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.admin.settings.store,
        queryFn: getAdminStoreSettings,
    });

    const [draft, setDraft] = useState<HomepageSectionDto[]>([]);
    const [showLayoutPicker, setShowLayoutPicker] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const initializedRef = useRef(false);

    // In mock mode, invalidate the admin settings cache when language changes
    // so section titles (which are language-aware in mock) update dynamically.
    useEffect(() => {
        if (USE_MOCK) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
        }
    }, [i18n.language, queryClient]);

    useEffect(() => {
        if (!data) return;
        const sections = data.homepageSections?.length ? data.homepageSections : defaultHomepageSections;

        if (!initializedRef.current) {
            initializedRef.current = true;
            setDraft(sections);
        } else {
            // Language changed: update section titles while preserving user edits and order
            setDraft(prev => prev.map(s => {
                const updated = sections.find(u => u.id === s.id);
                return updated ? { ...s, title: updated.title } : s;
            }));
        }
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const { mutate, isPending } = useMutation({
        mutationFn: updateStoreSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
            queryClient.invalidateQueries({ queryKey: queryKeys.store.settings });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        },
    });

    const handleSave = () => {
        if (!data) return;
        const ordered = draft.map((s, i) => ({ ...s, order: i }));
        mutate({ ...data, homepageSections: ordered });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = draft.findIndex((s) => s.id === active.id);
        const newIndex = draft.findIndex((s) => s.id === over.id);
        setDraft(arrayMove(draft, oldIndex, newIndex));
    };

    const updateSection = (index: number, section: HomepageSectionDto) => {
        const next = [...draft];
        next[index] = section;
        setDraft(next);
    };

    const deleteSection = (index: number) => {
        setDraft(draft.filter((_, i) => i !== index));
    };

    const addSection = (layout: SectionLayout) => {
        setDraft([...draft, newSection(layout, t)]);
        setShowLayoutPicker(false);
    };

    const layouts = getLayouts(t);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand-primary)' }} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-700 rounded-xl p-6 text-center">
                {t('design.common.saveError')}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                        <LayoutGrid className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('design.showcase.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('design.showcase.subtitle')}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-60"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                    <Save className="h-4 w-4" />
                    {isPending ? t('design.common.saving') : t('design.common.saveChanges')}
                </button>
            </div>

            {/* Success toast */}
            {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    {t('design.showcase.saveSuccess')}
                </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left — Editor */}
                <div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={draft.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                            {draft.map((section, i) => (
                                <SortableSectionCard
                                    key={section.id}
                                    section={section}
                                    index={i}
                                    total={draft.length}
                                    onChange={(s) => updateSection(i, s)}
                                    onDelete={() => deleteSection(i)}
                                    t={t}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {/* Add section */}
                    {draft.length < 12 && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowLayoutPicker(!showLayoutPicker)}
                                className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:bg-accent hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> {t('design.showcase.addSection')}
                            </button>
                            {showLayoutPicker && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-3 z-20">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">{t('design.showcase.selectLayout')}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {layouts.map((l) => {
                                            const Icon = LAYOUT_ICONS[l.value];
                                            return (
                                                <button key={l.value} type="button" onClick={() => addSection(l.value)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] transition-colors">
                                                    <Icon className="h-4 w-4" /> {l.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {draft.length >= 12 && (
                        <p className="text-xs text-muted-foreground text-center mt-2">{t('design.showcase.maxSections')}</p>
                    )}
                </div>

                {/* Right — Preview */}
                <div>
                    {/* Mobile toggle header */}
                    <button
                        type="button"
                        onClick={() => setPreviewOpen(!previewOpen)}
                        className="xl:hidden w-full flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border shadow-sm mb-2"
                    >
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{t('design.showcase.previewTitle')}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${previewOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Preview panel — always visible on xl, toggleable on mobile */}
                    <div className={`${previewOpen ? 'block' : 'hidden'} xl:block`}>
                        <div className="sticky top-6">
                            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                                <div className="hidden xl:flex items-center gap-2 px-4 py-3 border-b border-border bg-gray-50 dark:bg-white/5">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">{t('design.showcase.previewTitle')}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{t('design.showcase.previewNote')}</span>
                                </div>
                                {/* Scrollable scaled preview */}
                                <div className="relative overflow-x-hidden overflow-y-auto" style={{ height: '600px' }}>
                                    <div
                                        style={{
                                            transform: 'scale(0.45)',
                                            width: '222%',
                                            transformOrigin: 'top left',
                                        }}
                                    >
                                        <HomepageSections sections={draft.map((s, i) => ({ ...s, order: i }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
