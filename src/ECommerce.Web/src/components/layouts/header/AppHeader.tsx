import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserCircle } from 'lucide-react';
import logoImg from '@/assets/ebrar-logo.png';
import { HeaderSearchAutocomplete } from '@/features/catalog/components/HeaderSearchAutocomplete';
import { FavoriteButton } from './FavoriteButton';
import { BasketButton } from './BasketButton';
import { UserMenu } from './UserMenu';
import { useCategories } from '@/features/catalog/hooks/useCategories';

export function AppHeader() {
    const { isAuthenticated, isAuthLoading } = useAuthStore();
    const { data: categories, isLoading: isCategoriesLoading } = useCategories({ onlyMain: true });

    const headerRef = useRef<HTMLElement>(null);
    const [isStuck, setIsStuck] = useState(false);

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

    return (
        <>
            {/* ── Top Row — normal flow, scrolls away with the page ──────────── */}
            <header
                ref={headerRef}
                className="relative z-[51] bg-[#F5FFEA]"
            >
                <div className="w-full px-4 sm:px-6 lg:px-10 pt-1 lg:pt-0 pb-1 lg:pb-0">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 min-h-[70px] lg:min-h-[85px]">

                        {/* Logo + Mobile Actions */}
                        <div className="flex items-center justify-between w-full lg:w-[320px] lg:pl-10 relative">
                            <Link to="/" className="flex-shrink-0 group py-1 lg:py-0 lg:relative lg:z-[60] lg:-mb-12 transition-all">
                                <img
                                    src={logoImg}
                                    alt="Ebrar Kuruyemis"
                                    className="h-20 sm:h-24 lg:h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>

                            {/* Mobile Actions */}
                            <div className="flex lg:hidden items-center gap-3 sm:gap-5 flex-shrink-0">
                                <FavoriteButton />
                                <BasketButton />
                                {!isAuthLoading && (
                                    isAuthenticated
                                        ? <UserMenu />
                                        : (
                                            <div className="flex flex-col items-center group">
                                                <Link
                                                    to="/login"
                                                    className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-muted-foreground group-hover:text-[var(--color-ebrar-green)] group-hover:bg-green-50 transition-colors shadow-sm"
                                                >
                                                    <UserCircle className="h-6 w-6" />
                                                </Link>
                                                <span className="text-[11px] font-bold text-muted-foreground group-hover:text-[var(--color-ebrar-green)] mt-1 transition-colors">
                                                    Giriş
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex-1 w-full lg:w-auto max-w-2xl mx-auto flex flex-col items-center justify-center mt-2 lg:mt-0">
                            <HeaderSearchAutocomplete />
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex justify-end items-center lg:w-[320px] pr-4">
                            <div className="flex items-center gap-5 lg:gap-8 flex-shrink-0">
                                <FavoriteButton />
                                <BasketButton />
                                <div className="flex items-center ml-2 border-l border-border pl-5">
                                    <UserMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Category Nav — sticky, stays pinned at viewport top ────────── */}
            <nav
                className={[
                    'sticky top-0 z-50 w-full shadow-sm',
                    'transition-all duration-300 ease-in-out',
                    isStuck ? 'bg-[var(--color-ebrar-green)]' : 'bg-[#F5FFEA]',
                ].join(' ')}
            >
                <div className={[
                    'w-full lg:w-fit lg:min-w-[672px] mx-auto',
                    isStuck ? '' : 'border-t border-border',
                ].join(' ')}>
                    <ul className="flex items-center justify-start lg:justify-center gap-6 lg:gap-10 py-2 overflow-x-auto scrollbar-hide px-4 lg:px-2 min-h-[44px]">
                        {!isCategoriesLoading && categories?.map((category) => (
                            <li key={category.id} className="flex-shrink-0">
                                <Link
                                    to={`/products?categoryId=${category.id}`}
                                    className={[
                                        'flex items-center gap-1 text-sm font-medium font-serif transition-colors duration-300 whitespace-nowrap',
                                        isStuck
                                            ? 'text-white hover:text-white/80'
                                            : 'text-foreground hover:text-[var(--color-ebrar-green)]',
                                    ].join(' ')}
                                >
                                    {category.name}
                                    <ChevronDown className="h-3 w-3" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );
}
