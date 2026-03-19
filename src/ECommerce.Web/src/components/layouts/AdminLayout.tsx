import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    Users,
    MapPin,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Settings,
    CreditCard,
    Truck,
    Paintbrush,
    Image,
    Palette,
    SlidersHorizontal,
    Navigation,
    PanelBottom,
    LayoutGrid,
    MonitorCog,
    Store,
    Search,
    Layers,
    Megaphone,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useThemeStore } from '@/store/themeStore';
import { UserMenu } from '@/components/layouts/header/UserMenu';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

/* ─── Tip Yardımcıları ──────────────────────────────────────────────────── */

type LeafItem = {
    to: string;
    label: string;
    icon: React.ElementType;
};

type SubAccordionItem = {
    kind: 'sub-accordion';
    label: string;
    icon: React.ElementType;
    items: LeafItem[];
};

type SettingsItem = LeafItem | SubAccordionItem;

/* ─── Stil Yardımcıları ─────────────────────────────────────────────────── */

const ACTIVE_STYLE = {
    background: 'rgba(255,255,255,0.18)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
} as const;

const INACTIVE_STYLE = {
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    boxShadow: 'none',
} as const;

const HOVER_ON = (e: React.MouseEvent<HTMLElement>, isActive: boolean) => {
    if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.color = '#ffffff';
    }
};
const HOVER_OFF = (e: React.MouseEvent<HTMLElement>, isActive: boolean) => {
    if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
    }
};

/* ─── Alt Bileşenler ────────────────────────────────────────────────────── */

/** Tek düzey leaf link */
function SidebarLink({
    to,
    label,
    icon: Icon,
    isCollapsed,
    active,
    indent = false,
}: {
    to: string;
    label: string;
    icon: React.ElementType;
    isCollapsed: boolean;
    active: boolean;
    indent?: boolean;
}) {
    return (
        <Link
            to={to}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${indent && !isCollapsed ? 'pl-7' : 'px-3'} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap`}
            title={isCollapsed ? label : ''}
            style={active ? ACTIVE_STYLE : INACTIVE_STYLE}
            onMouseEnter={(e) => HOVER_ON(e, active)}
            onMouseLeave={(e) => HOVER_OFF(e, active)}
        >
            <Icon className="h-[16px] w-[16px] flex-shrink-0" />
            {!isCollapsed && <span>{label}</span>}
        </Link>
    );
}

/** İç accordion (Tasarım Ayarları gibi) */
function SidebarSubAccordion({
    item,
    isCollapsed,
    pathname,
    forceOpen,
}: {
    item: SubAccordionItem;
    isCollapsed: boolean;
    pathname: string;
    forceOpen?: boolean;
}) {
    const hasActiveChild = item.items.some((i) => pathname.startsWith(i.to));
    const [open, setOpen] = useState(hasActiveChild);
    const Icon = item.icon;

    useEffect(() => {
        if (forceOpen) setOpen(true);
        else if (!hasActiveChild) setOpen(false);
    }, [forceOpen, hasActiveChild]);

    if (isCollapsed) {
        return (
            <div className="relative group">
                <button
                    className="flex items-center justify-center w-full px-3 py-2 rounded-lg transition-all duration-200"
                    title={item.label}
                    style={hasActiveChild ? ACTIVE_STYLE : INACTIVE_STYLE}
                    onMouseEnter={(e) => HOVER_ON(e, hasActiveChild)}
                    onMouseLeave={(e) => HOVER_OFF(e, hasActiveChild)}
                    onClick={() => setOpen((o) => !o)}
                >
                    <Icon className="h-[16px] w-[16px] flex-shrink-0" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <button
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={hasActiveChild ? ACTIVE_STYLE : INACTIVE_STYLE}
                onMouseEnter={(e) => HOVER_ON(e, hasActiveChild)}
                onMouseLeave={(e) => HOVER_OFF(e, hasActiveChild)}
                onClick={() => setOpen((o) => !o)}
            >
                <Icon className="h-[16px] w-[16px] flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className="overflow-hidden transition-all duration-200"
                style={{ maxHeight: open ? `${item.items.length * 46}px` : '0px' }}
            >
                <div className="mt-0.5 flex flex-col gap-0.5">
                    {item.items.map((child) => (
                        <SidebarLink
                            key={child.to}
                            to={child.to}
                            label={child.label}
                            icon={child.icon}
                            isCollapsed={false}
                            active={pathname.startsWith(child.to)}
                            indent
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Ana Ayarlar accordion grubu */
function SidebarSettingsAccordion({
    isCollapsed,
    pathname,
    items,
    forceOpen,
    label,
}: {
    isCollapsed: boolean;
    pathname: string;
    items: SettingsItem[];
    forceOpen?: boolean;
    label: string;
}) {
    const hasActiveChild = pathname.startsWith('/admin/settings');
    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (forceOpen) setOpen(true);
        else if (!hasActiveChild) setOpen(false);
    }, [forceOpen, hasActiveChild]);

    if (items.length === 0) return null;

    if (isCollapsed) {
        return (
            <button
                className="flex items-center justify-center w-full px-3 py-2 rounded-lg transition-all duration-200"
                title={label}
                style={hasActiveChild ? ACTIVE_STYLE : INACTIVE_STYLE}
                onMouseEnter={(e) => HOVER_ON(e, hasActiveChild)}
                onMouseLeave={(e) => HOVER_OFF(e, hasActiveChild)}
                onClick={() => setOpen((o) => !o)}
            >
                <Settings className="h-[18px] w-[18px] flex-shrink-0" />
            </button>
        );
    }

    return (
        <div>
            <button
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={hasActiveChild ? ACTIVE_STYLE : INACTIVE_STYLE}
                onMouseEnter={(e) => HOVER_ON(e, hasActiveChild)}
                onMouseLeave={(e) => HOVER_OFF(e, hasActiveChild)}
                onClick={() => setOpen((o) => !o)}
            >
                <Settings className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className="overflow-hidden transition-all duration-200"
                style={{ maxHeight: open ? '600px' : '0px' }}
            >
                <div className="mt-0.5 flex flex-col gap-0.5 pl-2">
                    {items.map((item, idx) => {
                        if ('kind' in item && item.kind === 'sub-accordion') {
                            return (
                                <SidebarSubAccordion
                                    key={idx}
                                    item={item}
                                    isCollapsed={false}
                                    pathname={pathname}
                                    forceOpen={forceOpen}
                                />
                            );
                        }
                        const leaf = item as LeafItem;
                        return (
                            <SidebarLink
                                key={leaf.to}
                                to={leaf.to}
                                label={leaf.label}
                                icon={leaf.icon}
                                isCollapsed={false}
                                active={pathname.startsWith(leaf.to)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ─── Ana Layout ────────────────────────────────────────────────────────── */

export function AdminLayout() {
    const { t, i18n } = useTranslation('admin');
    const location = useLocation();
    const settings = useStoreSettings();
    const { resolved: theme } = useThemeStore();
    const isDark = theme === 'dark';
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentLocale = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.locale ?? 'tr-TR';

    const isActive = (to: string, exact: boolean) =>
        exact ? location.pathname === to : location.pathname.startsWith(to);

    // Nav links defined inside component so they can use t()
    const navLinks = useMemo(() => [
        { to: '/admin', label: t('nav.dashboard'), icon: LayoutDashboard, exact: true },
        { to: '/admin/products', label: t('nav.products'), icon: Package, exact: false },
        { to: '/admin/categories', label: t('nav.categories'), icon: FolderTree, exact: false },
        { to: '/admin/orders', label: t('nav.orders'), icon: ShoppingBag, exact: false },
        { to: '/admin/users', label: t('nav.users'), icon: Users, exact: false },
        { to: '/admin/addresses', label: t('nav.addresses'), icon: MapPin, exact: false },
    ], [t]);

    const settingsItems: SettingsItem[] = useMemo(() => [
        { to: '/admin/settings/payment', label: t('nav.payment'), icon: CreditCard },
        { to: '/admin/settings/shipping', label: t('nav.shipping'), icon: Truck },
        {
            kind: 'sub-accordion' as const,
            label: t('nav.design'),
            icon: Paintbrush,
            items: [
                { to: '/admin/settings/design/logo', label: t('nav.logo'), icon: Image },
                { to: '/admin/settings/design/background', label: t('nav.background'), icon: Layers },
                { to: '/admin/settings/design/banner', label: t('nav.banner'), icon: Megaphone },
                { to: '/admin/settings/design/colors', label: t('nav.colors'), icon: Palette },
                { to: '/admin/settings/design/hero', label: t('nav.hero'), icon: SlidersHorizontal },
                { to: '/admin/settings/design/nav', label: t('nav.navOrder'), icon: Navigation },
                { to: '/admin/settings/design/banners', label: t('nav.banners'), icon: LayoutGrid },
                { to: '/admin/settings/design/footer', label: t('nav.footer'), icon: PanelBottom },
            ],
        },
    ], [t]);

    const filteredNavLinks = useMemo(() => {
        if (!searchQuery) return navLinks;
        const lowerQ = searchQuery.toLocaleLowerCase(currentLocale);
        return navLinks.filter(link => link.label.toLocaleLowerCase(currentLocale).includes(lowerQ));
    }, [searchQuery, navLinks, currentLocale]);

    const filteredSettingsItems = useMemo(() => {
        if (!searchQuery) return settingsItems;
        const lowerQ = searchQuery.toLocaleLowerCase(currentLocale);
        return settingsItems.map(item => {
            if ('kind' in item && item.kind === 'sub-accordion') {
                const childMatches = item.items.filter(child => child.label.toLocaleLowerCase(currentLocale).includes(lowerQ));
                if (item.label.toLocaleLowerCase(currentLocale).includes(lowerQ) || childMatches.length > 0) {
                    return {
                        ...item,
                        items: item.label.toLocaleLowerCase(currentLocale).includes(lowerQ) ? item.items : childMatches
                    };
                }
                return null;
            } else {
                const leaf = item as LeafItem;
                if (leaf.label.toLocaleLowerCase(currentLocale).includes(lowerQ)) return leaf;
                return null;
            }
        }).filter(Boolean) as SettingsItem[];
    }, [searchQuery, settingsItems, currentLocale]);

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* ── Sidebar ── */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col shadow-xl transition-all duration-300 ease-in-out relative`}
                style={{ background: isDark ? 'var(--brand-tinted-dark-bg)' : settings.primaryColor }}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-card rounded-full p-1 shadow-md hover:bg-accent transition-colors z-50"
                    style={{ color: 'var(--brand-primary)', border: `1px solid ${isDark ? 'hsl(var(--border))' : '#e5e7eb'}` }}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                {/* Logo / Başlık & Arama */}
                <div
                    className="px-5 py-5 flex flex-col gap-4 overflow-hidden whitespace-nowrap"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        >
                            <MonitorCog className="h-5 w-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="transition-opacity duration-300 min-w-0">
                                {settings.storeName ? (
                                    <>
                                        <div className="text-white font-bold text-base leading-tight truncate">
                                            {settings.storeName}
                                        </div>
                                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {t('nav.panel')}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-white font-bold text-base leading-tight">
                                        {t('nav.panel')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Arama Çubuğu */}
                    {!isCollapsed && (
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
                            <input
                                type="text"
                                placeholder={t('nav.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 text-sm rounded-lg pl-9 pr-3 py-2 outline-none transition-colors"
                            />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                    {filteredNavLinks.map((link) => {
                        const active = isActive(link.to, link.exact);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                                title={isCollapsed ? link.label : ''}
                                style={{
                                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                                    color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                }}
                                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    }
                                }}
                            >
                                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                                {!isCollapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}

                    {/* ── Separator ── */}
                    <div className="my-2 px-1">
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                    </div>

                    {/* ── Ayarlar Accordion ── */}
                    <SidebarSettingsAccordion
                        isCollapsed={isCollapsed}
                        pathname={location.pathname}
                        items={filteredSettingsItems}
                        forceOpen={searchQuery.length > 0}
                        label={t('nav.settings')}
                    />

                    {/* ── Separator ── */}
                    <div className="my-2 px-1">
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                    </div>

                    {/* Mağazaya Dön */}
                    <Link
                        to="/"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                        title={isCollapsed ? t('nav.backToStore') : ''}
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <ArrowLeft className="h-[18px] w-[18px] flex-shrink-0" />
                        {!isCollapsed && <span>{t('nav.backToStore')}</span>}
                    </Link>
                </nav>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="h-16 bg-card px-6 flex items-center justify-between flex-shrink-0 border-b border-border"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                    <div className="text-base sm:text-lg font-semibold" style={{ color: 'var(--brand-primary)' }}>
                        {t('nav.management')}
                    </div>

                    {/* Sağ Üst Aksiyonlar */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div
                            className="flex flex-col items-center group relative"
                            style={{ '--primary': 'var(--brand-primary)' } as React.CSSProperties}
                        >
                            <Link
                                to="/"
                                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-accent text-muted-foreground transition-all duration-300 shadow-sm border border-transparent outline-none group-hover:text-[var(--primary)] group-hover:bg-accent group-hover:border-border"
                                title={t('nav.backToStore')}
                            >
                                <Store className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] transition-transform duration-300 group-hover:scale-110" />
                            </Link>
                            <span className="text-[11px] sm:text-[11px] font-bold text-muted-foreground group-hover:text-[var(--primary)] mt-[2px] sm:mt-1 transition-colors capitalize">
                                {t('nav.store')}
                            </span>
                        </div>

                        <div className="w-px h-6 bg-border hidden sm:block"></div>

                        <ThemeToggle />

                        <div className="w-px h-6 bg-border hidden sm:block"></div>

                        <LanguageToggle />

                        <div className="border-l border-border pl-3 sm:pl-4 flex items-center">
                            <UserMenu />
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
