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
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Save,
    Plus,
    Trash2,
    ChevronDown,
    Eye,
    Link as LinkIcon,
    Phone,
    Users,
    Info,
} from 'lucide-react';
import { getAdminStoreSettings, updateStoreSettings } from '../api/storeSettingsApi';
import type {
    FooterSettingsDto,
    FooterColumnDto,
    FooterColumnType,
    FooterLinkDto,
    FooterSocialLinkDto,
    FooterBottomLinkDto,
    SocialPlatform,
} from '../api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { Footer } from '@/features/catalog/components/Footer';
import { TranslatableInput } from '../components/TranslatableInput';

// ── Helpers ───────────────────────────────────────────────────────────────────

function newColumn(type: FooterColumnType, order: number, t: TFunction): FooterColumnDto {
    const titles: Record<FooterColumnType, string> = {
        links: t('design.footer.colLinks'),
        contact: t('design.footer.colContact'),
        social: t('design.footer.colSocial'),
        about: t('design.footer.colAbout'),
    };
    return {
        id: crypto.randomUUID(),
        type,
        title: titles[type],
        order,
        enabled: true,
        links: type === 'links' ? [] : undefined,
        socialLinks: type === 'social' ? [] : undefined,
    };
}

function newLink(t: TFunction): FooterLinkDto {
    return { id: crypto.randomUUID(), label: t('design.footer.defaultLink'), url: '#', order: 0 };
}

function newSocialLink(): FooterSocialLinkDto {
    return { id: crypto.randomUUID(), platform: 'instagram', url: '#' };
}

function newBottomLink(t: TFunction): FooterBottomLinkDto {
    return { id: crypto.randomUUID(), label: t('design.footer.defaultBottomLink'), url: '#', order: 0 };
}

// ── Shared sub-components ─────────────────────────────────────────────────────

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

function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            {label && <span className="text-sm text-muted-foreground">{label}</span>}
            <div className="relative">
                <input
                    type="color"
                    value={value ?? '#ffffff'}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                    id={`color-${label ?? 'inp'}`}
                />
                <label
                    htmlFor={`color-${label ?? 'inp'}`}
                    className="block w-8 h-8 rounded-lg border-2 border-border cursor-pointer shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: value }}
                />
            </div>
            <input
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm font-mono border border-border rounded px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] bg-background text-foreground"
                placeholder="#000000"
            />
        </label>
    );
}

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'whatsapp', label: 'WhatsApp' },
];

const TYPE_ICONS: Record<FooterColumnType, React.ComponentType<{ className?: string }>> = {
    links: LinkIcon,
    contact: Phone,
    social: Users,
    about: Info,
};

function getTypeLabels(t: TFunction): Record<FooterColumnType, string> {
    return {
        links: t('design.footer.colLinks'),
        contact: t('design.footer.colContact'),
        social: t('design.footer.colSocial'),
        about: t('design.footer.colAbout'),
    };
}

// ── Column Editor ─────────────────────────────────────────────────────────────

interface ColumnEditorProps {
    col: FooterColumnDto;
    onChange: (updated: FooterColumnDto) => void;
    onDelete: () => void;
    canDelete: boolean;
    t: TFunction;
}

function ColumnEditor({ col, onChange, onDelete, canDelete, t }: ColumnEditorProps) {
    const [expanded, setExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: col.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const set = <K extends keyof FooterColumnDto>(key: K, value: FooterColumnDto[K]) =>
        onChange({ ...col, [key]: value });

    const updateTranslation = (lang: string, field: string, val: string) => {
        const newTranslations = JSON.parse(JSON.stringify(col.translations || {}));
        if (!newTranslations[lang]) newTranslations[lang] = {};
        newTranslations[lang][field] = val;
        set('translations', newTranslations);
    };

    const updateLinkTranslation = (linkIdx: number, lang: string, field: string, val: string) => {
        const updatedLinks = [...(col.links ?? [])];
        const link = { ...updatedLinks[linkIdx] };
        const newTranslations = JSON.parse(JSON.stringify(link.translations || {}));
        if (!newTranslations[lang]) newTranslations[lang] = {};
        newTranslations[lang][field] = val;
        link.translations = newTranslations;
        updatedLinks[linkIdx] = link;
        set('links', updatedLinks);
    };

    const TypeIcon = TYPE_ICONS[col.type];
    const typeLabels = getTypeLabels(t);

    return (
        <div ref={setNodeRef} style={style} className="bg-card rounded-xl shadow-sm border border-border mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 select-none">
                <button
                    type="button"
                    className="cursor-grab text-muted-foreground hover:text-foreground p-1 flex-shrink-0"
                    {...attributes}
                    {...listeners}
                    aria-label={t('design.navOrder.dragHint')}
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {col.title || typeLabels[col.type]}
                </span>

                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                    {typeLabels[col.type]}
                </span>

                <Toggle checked={col.enabled} onChange={(v) => set('enabled', v)} />

                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={expanded ? t('design.navOrder.dragHint') : t('design.common.add')}
                >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    disabled={!canDelete}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={t('design.common.delete')}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Body */}
            {expanded && (
                <div className="border-t border-border p-4 space-y-4">
                    {/* Title + Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                {t('design.footer.columnTitle')}
                            </label>
                            <TranslatableInput
                                value={col.title}
                                onChange={(v) => set('title', v)}
                                translations={col.translations}
                                field="title"
                                onTranslationChange={updateTranslation}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                {t('design.footer.selectType').replace(':', '')}
                            </label>
                            <div className="flex gap-1 flex-wrap">
                                {(['links', 'contact', 'social', 'about'] as FooterColumnType[]).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => set('type', type)}
                                        className={`px-2 py-1 text-xs rounded-md border transition-colors ${col.type === type ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]' : 'bg-card text-muted-foreground border-border hover:border-[var(--brand-primary)]'}`}
                                    >
                                        {typeLabels[type]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* type=links */}
                    {col.type === 'links' && (
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-2">
                                {t('design.footer.linksTitle')}
                            </label>
                            <div className="space-y-2">
                                {(col.links ?? []).map((link, idx) => (
                                    <div key={link.id} className="flex gap-2 items-start mt-2">
                                        <div className="flex-1">
                                            <TranslatableInput
                                                value={link.label}
                                                onChange={(v) => {
                                                    const updated = [...(col.links ?? [])];
                                                    updated[idx] = { ...link, label: v };
                                                    set('links', updated);
                                                }}
                                                translations={link.translations}
                                                field="label"
                                                onTranslationChange={(lang, field, val) => updateLinkTranslation(idx, lang, field, val)}
                                                placeholder={t('design.footer.linkLabel')}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const updated = [...(col.links ?? [])];
                                                updated[idx] = { ...link, url: e.target.value };
                                                set('links', updated);
                                            }}
                                            placeholder={t('design.footer.linkUrl')}
                                            className="flex-1 border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]/40 bg-background text-foreground"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = (col.links ?? []).filter((_, i) => i !== idx);
                                                set('links', updated);
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => set('links', [...(col.links ?? []), { ...newLink(t), order: (col.links ?? []).length }])}
                                className="mt-2 flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline"
                            >
                                <Plus className="h-3.5 w-3.5" /> {t('design.footer.addLink')}
                            </button>
                        </div>
                    )}

                    {/* type=contact */}
                    {col.type === 'contact' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    {t('design.footer.phone')}
                                </label>
                                <input
                                    type="text"
                                    value={col.phone ?? ''}
                                    onChange={(e) => set('phone', e.target.value || undefined)}
                                    placeholder={t('design.footer.phonePlaceholder')}
                                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    {t('design.footer.email')}
                                </label>
                                <input
                                    type="email"
                                    value={col.email ?? ''}
                                    onChange={(e) => set('email', e.target.value || undefined)}
                                    placeholder={t('design.footer.emailPlaceholder')}
                                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    {t('design.footer.address')}
                                </label>
                                <TranslatableInput
                                    value={col.address ?? ''}
                                    onChange={(v) => set('address', v || undefined)}
                                    translations={col.translations}
                                    field="address"
                                    onTranslationChange={updateTranslation}
                                    placeholder={t('design.footer.addressPlaceholder')}
                                    textarea
                                />
                            </div>
                        </div>
                    )}

                    {/* type=social */}
                    {col.type === 'social' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    {t('design.footer.socialText')}
                                </label>
                                <TranslatableInput
                                    value={col.followText ?? ''}
                                    onChange={(v) => set('followText', v || undefined)}
                                    translations={col.translations}
                                    field="followText"
                                    onTranslationChange={updateTranslation}
                                    placeholder={t('design.footer.socialTextPlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-2">
                                    {t('design.footer.accounts')}
                                </label>
                                <div className="space-y-2">
                                    {(col.socialLinks ?? []).map((sl, idx) => (
                                        <div key={sl.id} className="flex gap-2 items-center">
                                            <select
                                                value={sl.platform}
                                                onChange={(e) => {
                                                    const updated = [...(col.socialLinks ?? [])];
                                                    updated[idx] = { ...sl, platform: e.target.value as SocialPlatform };
                                                    set('socialLinks', updated);
                                                }}
                                                className="border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]/40 bg-background text-foreground"
                                            >
                                                {SOCIAL_PLATFORMS.map((p) => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={sl.url}
                                                onChange={(e) => {
                                                    const updated = [...(col.socialLinks ?? [])];
                                                    updated[idx] = { ...sl, url: e.target.value };
                                                    set('socialLinks', updated);
                                                }}
                                                placeholder="https://..."
                                                className="flex-1 border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]/40 bg-background text-foreground"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = (col.socialLinks ?? []).filter((_, i) => i !== idx);
                                                    set('socialLinks', updated);
                                                }}
                                                className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => set('socialLinks', [...(col.socialLinks ?? []), newSocialLink()])}
                                    className="mt-2 flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline"
                                >
                                    <Plus className="h-3.5 w-3.5" /> {t('design.footer.addAccount')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* type=about */}
                    {col.type === 'about' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{t('design.footer.showLogo')}</span>
                                <Toggle
                                    checked={col.showLogo ?? false}
                                    onChange={(v) => set('showLogo', v)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    {t('design.footer.aboutDesc')}
                                </label>
                                <TranslatableInput
                                    value={col.description ?? ''}
                                    onChange={(v) => set('description', v || undefined)}
                                    translations={col.translations}
                                    field="description"
                                    onTranslationChange={updateTranslation}
                                    placeholder={t('design.footer.aboutDescPlaceholder')}
                                    textarea
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export default function AdminFooterPage() {
    const { t, i18n } = useTranslation('admin');
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState<FooterSettingsDto | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const initializedRef = useRef(false);

    const { data: settings, isLoading } = useQuery({
        queryKey: queryKeys.admin.settings.store,
        queryFn: getAdminStoreSettings,
    });

    // In mock mode, invalidate settings cache when language changes
    useEffect(() => {
        if (USE_MOCK) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
        }
    }, [i18n.language, queryClient]);

    useEffect(() => {
        if (!settings?.footer) return;

        if (!initializedRef.current) {
            initializedRef.current = true;
            setDraft(settings.footer);
        } else {
            // Language changed: update column titles and bottom link labels only
            setDraft(prev => {
                if (!prev) return settings.footer;
                return {
                    ...prev,
                    columns: prev.columns.map(col => {
                        const updated = settings.footer.columns.find(c => c.id === col.id);
                        return updated ? { ...col, title: updated.title } : col;
                    }),
                    bottomLinks: prev.bottomLinks.map(link => {
                        const updated = settings.footer.bottomLinks.find(l => l.id === link.id);
                        return updated ? { ...link, label: updated.label } : link;
                    }),
                };
            });
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: async (footer: FooterSettingsDto) => {
            if (!settings) return;
            await updateStoreSettings({ ...settings, footer });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
            void queryClient.invalidateQueries({ queryKey: queryKeys.store.settings });
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    if (isLoading || !draft) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <div className="animate-spin h-8 w-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full mx-auto mb-3" />
                {t('design.common.loading')}
            </div>
        );
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    const updateColumn = (id: string, updated: FooterColumnDto) =>
        setDraft((d) => d ? { ...d, columns: d.columns.map((c) => c.id === id ? updated : c) } : d);

    const deleteColumn = (id: string) =>
        setDraft((d) => d ? { ...d, columns: d.columns.filter((c) => c.id !== id) } : d);

    const addColumn = (type: FooterColumnType) => {
        if (draft.columns.length >= 4) return;
        const col = newColumn(type, draft.columns.length, t);
        setDraft((d) => d ? { ...d, columns: [...d.columns, col] } : d);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const cols = draft.columns;
        const oldIdx = cols.findIndex((c) => c.id === active.id);
        const newIdx = cols.findIndex((c) => c.id === over.id);
        const reordered = arrayMove(cols, oldIdx, newIdx).map((c, i) => ({ ...c, order: i }));
        setDraft((d) => d ? { ...d, columns: reordered } : d);
    };

    const setGlobal = <K extends keyof FooterSettingsDto>(key: K, value: FooterSettingsDto[K]) =>
        setDraft((d) => d ? { ...d, [key]: value } : d);

    const updateBottomLinkTranslation = (linkIdx: number, lang: string, field: string, val: string) => {
        if (!draft) return;
        const updatedLinks = [...draft.bottomLinks];
        const link = { ...updatedLinks[linkIdx] };
        const newTranslations = JSON.parse(JSON.stringify(link.translations || {}));
        if (!newTranslations[lang]) newTranslations[lang] = {};
        newTranslations[lang][field] = val;
        link.translations = newTranslations;
        updatedLinks[linkIdx] = link;
        setGlobal('bottomLinks', updatedLinks);
    };

    const sortedCols = [...draft.columns].sort((a, b) => a.order - b.order);
    const canAdd = draft.columns.length < 4;

    const alignOptions: { value: FooterSettingsDto['bottomBarAlignment']; labelKey: string }[] = [
        { value: 'left', labelKey: 'design.footer.alignLeft' },
        { value: 'center', labelKey: 'design.footer.alignCenter' },
        { value: 'between', labelKey: 'design.footer.alignSpaceBetween' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-card border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('design.footer.title')}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{t('design.footer.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {mutation.isSuccess && (
                            <span className="text-sm text-green-600 font-medium">{t('design.footer.saveSuccess')}</span>
                        )}
                        {mutation.isError && (
                            <span className="text-sm text-red-600 font-medium">{t('design.footer.saveError')}</span>
                        )}
                        <button
                            type="button"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate(draft)}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {mutation.isPending ? t('design.common.saving') : t('design.common.saveChanges')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 xl:items-start">
                {/* ── LEFT: Editor ─────────────────────────────────────────── */}
                <div className="space-y-5">

                    {/* Global settings */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <h3 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">
                            {t('design.footer.generalSettings')}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground">{t('design.footer.bgColor')}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{t('design.footer.bgColorHint')}</span>
                                    <ColorInput
                                        value={draft.backgroundColor ?? '#2C3E50'}
                                        onChange={(v) => setGlobal('backgroundColor', v)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground">{t('design.footer.textColor')}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{t('design.footer.textColorHint')}</span>
                                    <ColorInput
                                        value={draft.textColor ?? '#FFFFFF'}
                                        onChange={(v) => setGlobal('textColor', v)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground mb-1">{t('design.footer.copyright')}</label>
                                <input
                                    type="text"
                                    value={draft.copyrightText}
                                    onChange={(e) => setGlobal('copyrightText', e.target.value)}
                                    placeholder={t('design.footer.copyrightHint')}
                                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 bg-background text-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">{t('design.footer.copyrightDesc')}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground mb-1">{t('design.footer.bottomAlign')}</label>
                                <div className="flex gap-2">
                                    {alignOptions.map((opt) => (
                                        <button
                                            key={opt.value as string}
                                            type="button"
                                            onClick={() => setGlobal('bottomBarAlignment', opt.value)}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${draft.bottomBarAlignment === opt.value ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]' : 'bg-card text-muted-foreground border-border hover:border-[var(--brand-primary)]'}`}
                                        >
                                            {t(opt.labelKey as Parameters<TFunction>[0])}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                            <h3 className="text-base font-semibold text-foreground">{t('design.footer.columns')}</h3>
                            <span className="text-xs text-muted-foreground">{draft.columns.length} / 4</span>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedCols.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sortedCols.map((col) => (
                                    <ColumnEditor
                                        key={col.id}
                                        col={col}
                                        onChange={(updated) => updateColumn(col.id, updated)}
                                        onDelete={() => deleteColumn(col.id)}
                                        canDelete={draft.columns.length > 1}
                                        t={t}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {/* Add column */}
                        {canAdd ? (
                            <div className="mt-3">
                                <p className="text-xs font-medium text-muted-foreground mb-2">{t('design.footer.selectType')}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {(['links', 'contact', 'social', 'about'] as FooterColumnType[]).map((type) => {
                                        const Icon = TYPE_ICONS[type];
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => addColumn(type)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-dashed border-border text-muted-foreground hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                <Icon className="h-3.5 w-3.5" />
                                                {getTypeLabels(t)[type]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="mt-3 text-xs text-muted-foreground text-center">
                                {t('design.footer.maxColumns')}
                            </p>
                        )}
                    </div>

                    {/* Bottom bar links */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-5">
                        <h3 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-border">
                            {t('design.footer.bottomLinks')}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">{t('design.footer.bottomLinksDesc')}</p>
                        <div className="space-y-2">
                            {draft.bottomLinks.map((link, idx) => (
                                <div key={link.id} className="flex gap-2 items-start mt-2">
                                    <div className="flex-1">
                                        <TranslatableInput
                                            value={link.label}
                                            onChange={(v) => {
                                                const updated = [...draft.bottomLinks];
                                                updated[idx] = { ...link, label: v };
                                                setGlobal('bottomLinks', updated);
                                            }}
                                            translations={link.translations}
                                            field="label"
                                            onTranslationChange={(lang, field, val) => updateBottomLinkTranslation(idx, lang, field, val)}
                                            placeholder={t('design.footer.linkLabel')}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => {
                                            const updated = [...draft.bottomLinks];
                                            updated[idx] = { ...link, url: e.target.value };
                                            setGlobal('bottomLinks', updated);
                                        }}
                                        placeholder={t('design.footer.linkUrl')}
                                        className="flex-1 border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]/40 bg-background text-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setGlobal('bottomLinks', draft.bottomLinks.filter((_, i) => i !== idx))}
                                        className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setGlobal('bottomLinks', [...draft.bottomLinks, { ...newBottomLink(t), order: draft.bottomLinks.length }])}
                            className="mt-3 flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline"
                        >
                            <Plus className="h-3.5 w-3.5" /> {t('design.footer.addLink')}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Live Preview ──────────────────────────────────── */}
                <div className="mt-5 xl:mt-0">
                    {/* Mobile toggle */}
                    <button
                        type="button"
                        onClick={() => setPreviewOpen(!previewOpen)}
                        className="xl:hidden w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl shadow-sm mb-3 text-sm font-medium text-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-[var(--brand-primary)]" />
                            {t('design.footer.previewTitle')}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${previewOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`${previewOpen ? 'block' : 'hidden'} xl:block`}>
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-[var(--brand-primary)]" />
                                    {t('design.footer.previewTitle')}
                                </span>
                                <span className="text-xs text-muted-foreground">{t('design.footer.previewNote')}</span>
                            </div>

                            {/* Scaled preview */}
                            <div
                                className="relative overflow-x-hidden overflow-y-auto"
                                style={{ height: '400px' }}
                            >
                                <div
                                    style={{
                                        transform: 'scale(0.45)',
                                        transformOrigin: 'top left',
                                        width: '222%',
                                    }}
                                >
                                    <Footer override={draft} key={i18n.language} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
