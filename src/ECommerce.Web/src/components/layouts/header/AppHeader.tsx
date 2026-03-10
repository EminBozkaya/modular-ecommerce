import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserCircle } from 'lucide-react';
import logoImg from '@/assets/ebrar-logo.jpeg';
import { HeaderSearchAutocomplete } from '@/features/catalog/components/HeaderSearchAutocomplete';
import { FavoriteButton } from './FavoriteButton';
import { BasketButton } from './BasketButton';
import { UserMenu } from './UserMenu';

const navItems = [
    { label: 'Kuruyemis', to: '/products?categoryId=1', hasDropdown: true },
    { label: 'Kuru Meyve', to: '/products?categoryId=4', hasDropdown: true },
    { label: 'Tohum & Bakliyat', to: '/products?categoryId=2', hasDropdown: true },
    { label: 'Uyelik Kulubu', to: '/products', hasDropdown: false },
    { label: 'Hediyeler', to: '/products', hasDropdown: false },
    { label: 'Tum Urunler', to: '/products', hasDropdown: false, isHighlighted: true },
];

export function AppHeader() {
    const { isAuthenticated, isAuthLoading } = useAuthStore();

    return (
        <header className="relative bg-white border-b border-border z-50">
            <div className="w-full px-4 sm:px-6 lg:px-10 pt-1 lg:pt-0 pb-1 lg:pb-0">

                {/* Top Row */}
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
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-muted-foreground hover:text-[var(--color-ebrar-green)] hover:bg-green-50 transition-colors"
                                        >
                                            <UserCircle className="h-6 w-6" />
                                        </Link>
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

                {/* Category Nav */}
                <div className="w-full mt-1 lg:mt-0 relative z-40 bg-white">
                    <div className="w-full lg:w-fit lg:min-w-[672px] mx-auto border-t border-border">
                        <nav className="w-full py-1">
                            <ul className="flex items-center justify-start lg:justify-center gap-6 lg:gap-10 py-2 overflow-x-auto scrollbar-hide px-2">
                                {navItems.map((item) => (
                                    <li key={item.label} className="flex-shrink-0">
                                        <Link
                                            to={item.to}
                                            className={[
                                                'flex items-center gap-1 text-sm font-medium font-serif transition-colors whitespace-nowrap',
                                                item.isHighlighted
                                                    ? 'text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)] border-b-2 border-[var(--color-ebrar-green)]'
                                                    : 'text-foreground hover:text-[var(--color-ebrar-green)]',
                                            ].join(' ')}
                                        >
                                            {item.label}
                                            {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
