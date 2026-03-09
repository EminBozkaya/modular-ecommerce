import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
    Heart,
    ShoppingCart,
    ChevronDown,
    Phone,
    Clock,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Package,
} from 'lucide-react';
import { useBasket } from '@/features/basket/hooks/useBasket';
import { useWishlistProductIds } from '@/features/favorites/hooks/useFavorites';
import { useBasketUiStore } from '@/store/basketUiStore';
import { BasketDrawer } from '@/features/basket/components/BasketDrawer';
import { LogOut, Settings, LayoutDashboard, UserCircle, MapPin as MapPinIcon, ShoppingBag } from 'lucide-react';
import { useEffect, useRef } from 'react';
import logoImg from '@/assets/ebrar-logo.jpeg';
import { HeaderSearchAutocomplete } from '@/features/catalog/components/HeaderSearchAutocomplete';

const navItems = [
    { label: 'Kuruyemiş', to: '/products?categoryId=1', hasDropdown: true },
    { label: 'Kuru Meyve', to: '/products?categoryId=4', hasDropdown: true },
    { label: 'Tohum & Bakliyat', to: '/products?categoryId=2', hasDropdown: true },
    { label: 'Üyelik Kulübü', to: '/products', hasDropdown: false },
    { label: 'Hediyeler', to: '/products', hasDropdown: false },
    { label: 'Tüm Ürünler', to: '/products', hasDropdown: false, isHighlighted: true },
];

export function MainLayout() {
    const { isAuthenticated, user, isAuthLoading } = useAuthStore();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { data: basket, isLoading: isBasketLoading } = useBasket();
    const { openDrawer } = useBasketUiStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitials = user?.fullName
        ? user.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : '??';

    const { data: wishlistIds } = useWishlistProductIds();
    const favoriteCount = wishlistIds?.length ?? 0;
    const itemCount = basket?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="relative bg-white border-b border-border z-50">
                <div className="w-full px-4 sm:px-6 lg:px-10 pt-1 lg:pt-0 pb-1 lg:pb-0">

                    {/* Top Row: Logo & Actions (Mobile) | Search & Actions (Desktop) */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 min-h-[70px] lg:min-h-[85px]">

                        {/* Mobile/Tablet Top Wrapper: Logo on Left, Actions on Right */}
                        <div className="flex items-center justify-between w-full lg:w-[320px] lg:pl-10 relative">
                            {/* Logo Area - Aligned to banner on desktop */}
                            <Link to="/" className="flex-shrink-0 group py-1 lg:py-0 lg:relative lg:z-[60] lg:-mb-12 transition-all">
                                <img
                                    src={logoImg}
                                    alt="Ebrar Kuruyemiş"
                                    className="h-20 sm:h-24 lg:h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>

                            {/* Actions Area (Mobile & Tablet) */}
                            <div className="flex lg:hidden items-center gap-3 sm:gap-5 flex-shrink-0">
                                <Link
                                    to="/favoriler"
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-muted-foreground hover:text-[var(--color-ebrar-green)] hover:bg-green-50 transition-colors"
                                >
                                    <Heart className="h-5 w-5" />
                                    {favoriteCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                            {favoriteCount}
                                        </span>
                                    )}
                                </Link>

                                <button
                                    onClick={openDrawer}
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-ebrar-green)] text-white hover:bg-[var(--color-ebrar-green-dark)] transition-colors shadow-sm"
                                    aria-label="Sepeti aç"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {!isBasketLoading && itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

                                {/* User Menu Mobile */}
                                {!isAuthLoading && (
                                    <div className="flex items-center relative" ref={userMenuRef}>
                                        {isAuthenticated ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-ebrar-green)] text-white font-bold text-sm border-2 border-white shadow-md hover:bg-[var(--color-ebrar-green-dark)] transition-all duration-200"
                                                    title={user?.fullName}
                                                >
                                                    {userInitials}
                                                </button>
                                                {/* Mobile Dropdown Menu Logic Here (Reusing existing dropdown below) */}
                                            </div>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-muted-foreground hover:text-[var(--color-ebrar-green)] hover:bg-green-50 transition-colors"
                                            >
                                                <UserCircle className="h-6 w-6" />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center Column: Search Bar */}
                        <div className="flex-1 w-full lg:w-auto max-w-2xl mx-auto flex flex-col items-center justify-center mt-2 lg:mt-0">
                            <HeaderSearchAutocomplete />
                        </div>

                        {/* Right Actions (Desktop Only) */}
                        <div className="hidden lg:flex justify-end items-center lg:w-[320px] pr-4">
                            <div className="flex items-center gap-5 lg:gap-8 flex-shrink-0">
                                <Link
                                    to="/favoriler"
                                    className="relative flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Heart className="h-4 w-4" />
                                    <span className="hidden sm:inline">Favoriler</span>
                                    {favoriteCount > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                            {favoriteCount}
                                        </span>
                                    )}
                                </Link>

                                {isAuthenticated && (
                                    <Link
                                        to="/orders"
                                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Package className="h-4 w-4" />
                                        <span className="hidden sm:inline">Siparislerim</span>
                                    </Link>
                                )}

                                <button
                                    onClick={openDrawer}
                                    className="relative flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Sepeti aç"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sepet</span>
                                    {!isBasketLoading && itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

                                {!isAuthLoading && (
                                    <div className="flex items-center ml-2 border-l border-border pl-5 relative" ref={userMenuRef}>
                                        {isAuthenticated ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-ebrar-green)] text-white font-bold text-sm border-2 border-white shadow-md hover:bg-[var(--color-ebrar-green-dark)] transition-all duration-200"
                                                    title={user?.fullName}
                                                >
                                                    {userInitials}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    to="/login"
                                                    className="text-sm font-semibold text-foreground hover:text-[var(--color-ebrar-green)] transition-all"
                                                >
                                                    Giriş
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className="px-4 py-2 text-sm font-bold text-white bg-[var(--color-ebrar-green)] rounded-full hover:bg-[var(--color-ebrar-green-dark)] shadow-md transition-all active:scale-95"
                                                >
                                                    Kayıt Ol
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dropdown Menu (Absolute positioned) */}
                        {isUserMenuOpen && isAuthenticated && (
                            <div className="absolute right-4 top-20 lg:top-auto lg:top-24 w-56 bg-white rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* ... existing dropdown content ... */}
                                <div className="px-4 py-3 border-b border-border mb-1">
                                    <p className="text-sm font-bold text-foreground truncate">{user?.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    {user?.role === 'Admin' && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Yönetici
                                        </span>
                                    )}
                                </div>
                                <div className="py-1">
                                    {user?.role === 'Admin' && (
                                        <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
                                            <LayoutDashboard className="h-4 w-4 text-blue-600" />
                                            Admin Paneli
                                        </Link>
                                    )}
                                    <button onClick={() => { setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left">
                                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                                        Profil Bilgileri
                                    </button>
                                    <button onClick={() => { setIsUserMenuOpen(false); navigate('/orders'); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left">
                                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                        Siparişlerim
                                    </button>
                                    <button onClick={() => { setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left">
                                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                        Adreslerim
                                    </button>
                                    <button onClick={() => { setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        Ayarlar
                                    </button>
                                </div>
                                <div className="mt-1 pt-1 border-t border-border">
                                    <button onClick={() => { setIsUserMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50">
                                        <LogOut className="h-4 w-4" />
                                        Güvenli Çıkış
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Navigation (New Row below main header content) */}
                    <div className="w-full mt-1 lg:mt-0 relative z-40 bg-white">
                        <div className="w-full lg:w-fit lg:min-w-[672px] mx-auto border-t border-border">
                            <nav className="w-full py-1">
                                <ul className="flex items-center justify-start lg:justify-center gap-6 lg:gap-10 py-2 overflow-x-auto scrollbar-hide px-2">
                                    {navItems.map((item) => (
                                        <li key={item.label} className="flex-shrink-0">
                                            <Link
                                                to={item.to}
                                                className={`flex items-center gap-1 text-sm font-medium font-serif transition-colors whitespace-nowrap ${item.isHighlighted
                                                    ? 'text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)] border-b-2 border-[var(--color-ebrar-green)]'
                                                    : 'text-foreground hover:text-[var(--color-ebrar-green)]'
                                                    }`}
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

            {/* Free Shipping Banner */}
            <div className="bg-[var(--color-ebrar-green)] py-2">
                <p className="text-center text-sm font-medium text-white tracking-wide">
                    100₺ ÜZERİ SİPARİŞLERDE KARGO BEDAVA!
                </p>
            </div>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-[var(--color-ebrar-green)] text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto text-center lg:text-left">
                        {/* About Us */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">HAKKIMIZDA</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><a href="#" className="hover:text-white transition-colors">Referanslar</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Müşteri Hizmetleri</a></li>
                            </ul>
                        </div>

                        {/* News & Tips */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">HABERLER & İPUÇLARI</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><a href="#" className="hover:text-white transition-colors">Kuruyemiş Haberleri</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Bilgi Köşesi</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tarifler</a></li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">İLETİŞİM</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><a href="#" className="hover:text-white transition-colors">Siparişlerim</a></li>
                                <li>
                                    <Link to="/products" className="hover:text-white transition-colors">
                                        Tüm Ürünler
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li className="flex items-center gap-2 justify-center lg:justify-start">
                                    <Phone className="h-4 w-4" />
                                    <span>0212 555 00 00</span>
                                </li>
                                <li className="flex items-center gap-2 justify-center lg:justify-start">
                                    <Clock className="h-4 w-4" />
                                    <span>09:00 – 18:00 Pts – Cum</span>
                                </li>
                                <li className="flex items-start gap-2 justify-center lg:justify-start">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <span>Atatürk Caddesi No: 42<br />İstanbul, Türkiye</span>
                                </li>
                            </ul>
                            <div className="flex items-center gap-3 mt-4 justify-center lg:justify-start">
                                <span className="text-sm text-white/80">Bizi takip edin:</span>
                                <a href="#" className="hover:text-white/80 transition-colors"><Facebook className="h-5 w-5" /></a>
                                <a href="#" className="hover:text-white/80 transition-colors"><Twitter className="h-5 w-5" /></a>
                                <a href="#" className="hover:text-white/80 transition-colors"><Instagram className="h-5 w-5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-white/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
                            <p>&copy; 2026 Ebrar Kuruyemiş. Tüm hakları saklıdır.</p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
                                <span>|</span>
                                <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                                <span>|</span>
                                <a href="#" className="hover:text-white transition-colors">Yasal Uyarı</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Basket Drawer */}
            <BasketDrawer />
        </div>
    );
}
