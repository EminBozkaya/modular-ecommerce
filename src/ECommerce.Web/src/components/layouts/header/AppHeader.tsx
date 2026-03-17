import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import logoImg from '@/assets/LOGO.png';
import { HeaderSearchAutocomplete } from '@/features/catalog/components/HeaderSearchAutocomplete';
import { FavoriteButton } from './FavoriteButton';
import { BasketButton } from './BasketButton';
import { UserMenu } from './UserMenu';
import { useCategories } from '@/features/catalog/hooks/useCategories';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CategoryNavDropdownItem } from './CategoryNavDropdownItem';
import { MobileCategoryDrawer } from './MobileCategoryDrawer';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export function AppHeader() {
    const { t } = useTranslation('common');
    const { isAuthenticated, isAuthLoading } = useAuthStore();
    const settings = useStoreSettings();

    // Resolve dynamic logo: uploaded base64 takes precedence over bundled asset
    const resolvedLogo = settings.imageBase64 ?? logoImg;

    // Tüm kategorileri çek — ağaç kurmak için
    const { data: allCategories, isLoading: isCategoriesLoading } = useCategories();

    const headerRef = useRef<HTMLElement>(null);
    const [isStuck, setIsStuck] = useState(false);

    // Scroll ve Peek Effect State
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Watch header visibility — when it leaves the viewport, nav is "stuck"
    useEffect(() => {
        const headerEl = headerRef.current;
        if (!headerEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsStuck(!entry.isIntersecting),
            { threshold: 0 },
        );
        observer.observe(headerEl);
        return () => observer.disconnect();
    }, []);

    const checkScroll = () => {
        requestAnimationFrame(() => {
            if (!scrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            // Eşik değerleri biraz daha esnek tutarak (ör: 5px) hassasiyeti artırıyoruz
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
        });
    };

    // Kategori ağaç datası hazır olduktan ve DOM çizimi (paint) bittikten sonra kontrol et
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Sayfa her yüklendiğinde veya kategori değiştiğinde kısa bir gecikmeyle kontrol et
        const timeout = setTimeout(checkScroll, 500);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeout);
        };
    }, [allCategories, isStuck]);

    // Hover ile kaydırma mantığı
    const startScrolling = (direction: 'left' | 'right') => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = setInterval(() => {
            if (scrollRef.current) {
                const scrollAmount = direction === 'left' ? -12 : 12; // Hız ayarı
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'auto' });
                checkScroll();
            }
        }, 16); // ~60fps smooth scroll
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    // Kategori ağacını kur: sonsuz derinlikte alt-kategori desteği
    const categoryTree = useMemo(() => {
        if (!allCategories) return [];
        const buildTree = (parentId: string | null): unknown[] => {
            return allCategories
                .filter((c) => c.parentCategoryId === parentId && c.isActive && !c.isDeleted)
                .map((c) => ({
                    category: c,
                    subCategories: buildTree(c.id),
                }));
        };
        return buildTree(null);
    }, [allCategories]);

    const navBg = isStuck ? settings.primaryColor : settings.backgroundColor;

    return (
        <>
            {/* ── Top Row — normal flow, scrolls away with the page ──────────── */}
            <header
                ref={headerRef}
                className="relative z-[51]"
                style={{ backgroundColor: settings.backgroundColor }}
            >
                <div className="w-full px-4 sm:px-6 md:px-10 pt-1 md:pt-0 pb-1 md:pb-0">
                    <div className="flex flex-row items-center justify-between gap-4 xl:gap-6 min-h-[70px] md:min-h-[85px]">

                        {/* Logo Column */}
                        {/* Menü duvarımız (sol hizalama) buraya bağlı: md'de 220px, xl'de 320px. (Padding değil width ile) */}
                        <div className="flex items-center justify-between w-full md:w-[220px] xl:w-[320px] flex-shrink-0 relative">
                            <Link to="/" className="flex-shrink-0 group flex items-center gap-2 md:gap-3 py-1 md:py-0 md:relative md:z-[60] md:-mb-10 xl:-mb-14 transition-all">
                                <img
                                    src={resolvedLogo}
                                    alt={settings.storeName}
                                    className="h-14 sm:h-20 md:h-24 xl:h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                {settings.showStoreNameInHeader && settings.storeName && (
                                    <span
                                        className="hidden md:block text-base lg:text-xl font-bold tracking-tight whitespace-nowrap transition-transform duration-300 group-hover:scale-105"
                                        style={{ color: settings.primaryColor }}
                                    >
                                        {settings.storeName}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Actions (Icons visible only on mobile) */}
                            <div className="flex md:hidden items-center gap-2 sm:gap-4 flex-shrink-0">
                                <LanguageToggle />
                                <FavoriteButton />
                                <BasketButton />
                                {!isAuthLoading && (
                                    isAuthenticated
                                        ? <UserMenu />
                                        : (
                                            <div className="flex items-center">
                                                {/* Adaptif Giriş Paneli: 540px üzerinde geniş butonlar, altında sadece ikon */}
                                                <div className="hidden min-[540px]:flex items-center gap-2 ml-1 sm:ml-2 border-l border-gray-200 pl-2 sm:pl-3">
                                                    <Link
                                                        to="/login"
                                                        className="text-[13px] font-bold text-muted-foreground hover:text-[var(--color-ebrar-green)] px-1 transition-colors whitespace-nowrap"
                                                    >
                                                        {t('header.login')}
                                                    </Link>
                                                    <Link
                                                        to="/register"
                                                        className="px-4 py-2 text-[13px] font-bold text-white rounded-full shadow-md transition-all active:scale-95 whitespace-nowrap"
                                                        style={{ backgroundColor: settings.primaryColor }}
                                                    >
                                                        {t('userMenu.register')}
                                                    </Link>
                                                </div>

                                                <div className="flex min-[540px]:hidden flex-col items-center group">
                                                    <Link
                                                        to="/login"
                                                        className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-muted-foreground hover:bg-green-50 transition-colors shadow-sm"
                                                    >
                                                        <UserCircle className="h-6 w-6" />
                                                    </Link>
                                                    <span className="text-[11px] font-bold text-muted-foreground mt-1 transition-colors">
                                                        {t('header.login')}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>

                        {/* Search Column (Desktop) */}
                        <div className="hidden md:flex flex-1 w-full min-w-0 max-w-none mx-auto flex-row items-center justify-center gap-2 px-4 xl:px-6">
                            <div className="flex-1 w-full relative">
                                <HeaderSearchAutocomplete />
                            </div>
                        </div>

                        {/* Desktop Actions Column */}
                        <div className="hidden md:flex justify-end items-center flex-shrink-0">
                            <div className="flex items-center gap-4 xl:gap-8 flex-shrink-0">
                                <LanguageToggle />
                                <FavoriteButton />
                                <BasketButton />
                                <div className="flex items-center ml-1 xl:ml-2 border-l border-border pl-3 xl:pl-5">
                                    <UserMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile Sticky Search & Hamburger ────────── */}
            <div 
                className={cn(
                    "md:hidden sticky top-0 z-50 w-full py-2 px-4 transition-all duration-300 ease-in-out",
                    isStuck ? "shadow-md" : "border-t border-border/50"
                )}
                style={{ backgroundColor: navBg }}
            >
                <div className="w-full max-w-[500px] mx-auto flex flex-row items-center justify-center gap-2">
                    {!isCategoriesLoading && (
                        <div className="flex-shrink-0">
                            <MobileCategoryDrawer tree={categoryTree} />
                        </div>
                    )}
                    <div className="flex-1 w-full relative">
                        <HeaderSearchAutocomplete />
                    </div>
                </div>
            </div>

            {/* ── Category Nav — sticky, stays pinned at viewport top (Masaüstü Özel) ────────── */}
            <nav
                className={cn(
                    'sticky top-0 z-50 w-full shadow-sm hidden md:block transition-all duration-300 ease-in-out',
                )}
                style={{ backgroundColor: navBg }}
            >
                <div className={cn(
                    'relative w-full mx-auto flex items-center',
                    !isStuck && 'border-t border-border mt-1'
                )}>
                    {/* Sol Kaydırma Oku & Gradient */}
                    <div
                        className={cn(
                            'absolute top-0 h-full flex items-center transition-all duration-300 z-20',
                            !isStuck ? 'left-[220px] xl:left-[320px]' : 'left-0',
                            canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        )}
                    >
                        <div
                            className="absolute inset-0 w-24 pointer-events-none"
                            style={{ background: `linear-gradient(to right, ${navBg}, transparent)` }}
                        />
                        <button
                            type="button"
                            onMouseEnter={() => startScrolling('left')}
                            onMouseLeave={stopScrolling}
                            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                            className="relative ml-2 w-8 h-8 rounded-full bg-white/40 hover:bg-white border border-white/20 shadow-sm flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group backdrop-blur-[2px]"
                            style={{ color: settings.primaryColor }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menü Scroll Container */}
                    {/* PL (Padding) yerine ML (Margin) kullanarak dışardan taşıp gitmesini/arkada görünmesini engelliyoruz */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className={cn(
                            'flex items-center min-h-[50px] overflow-x-auto scroll-smooth w-full',
                            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                            !isStuck
                                ? 'px-4 md:px-0 md:ml-[236px] xl:ml-[336px] md:pr-10'
                                : 'px-4'
                        )}
                    >
                        <ul className="flex items-center gap-6 xl:gap-10 flex-nowrap w-max pr-12 md:pr-24">
                            {!isCategoriesLoading && categoryTree.map((node) => (
                                <CategoryNavDropdownItem
                                    key={(node as { category: { id: string } }).category.id}
                                    node={node}
                                    isStuck={isStuck}
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Sağ Kaydırma Oku & Gradient */}
                    <div
                        className={cn(
                            'absolute right-0 top-0 h-full flex items-center px-4 transition-all duration-300 z-20',
                            canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        )}
                    >
                        <div
                            className="absolute inset-0 w-32 left-auto right-0 pointer-events-none"
                            style={{ background: `linear-gradient(to left, ${navBg}, transparent)` }}
                        />
                        <button
                            type="button"
                            onMouseEnter={() => startScrolling('right')}
                            onMouseLeave={stopScrolling}
                            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                            className="relative w-8 h-8 rounded-full bg-white/40 hover:bg-white border border-white/20 shadow-sm flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group backdrop-blur-[2px]"
                            style={{ color: settings.primaryColor }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
