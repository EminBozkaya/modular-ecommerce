import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
    Search,
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
import { useBasketUiStore } from '@/store/basketUiStore';
import { BasketDrawer } from '@/features/basket/components/BasketDrawer';

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

    const [searchQuery, setSearchQuery] = useState('');

    const itemCount = basket?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="relative bg-white border-b border-border">
                {/* Top Header Row */}
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold font-serif text-[var(--color-ebrar-green)]">
                                Ebrar Kuruyemiş
                            </h1>
                        </Link>

                        {/* Search Bar - Centered */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
                            <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                                <input
                                    type="text"
                                    placeholder="Premium kuruyemişlerde arayın..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 h-10 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="submit"
                                    className="h-10 w-10 flex items-center justify-center bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white transition-colors"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Favoriler</span>
                            </button>

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
                                <div className="flex items-center gap-2 ml-2 border-l border-border pl-3">
                                    {isAuthenticated ? (
                                        <>
                                            <span className="text-sm text-muted-foreground hidden md:inline">
                                                Merhaba, {user?.fullName}
                                            </span>
                                            {user?.role === 'Admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                                >
                                                    Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => logout()}
                                                disabled={isLoggingOut}
                                                className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50 transition-colors"
                                            >
                                                Çıkış
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="text-sm font-medium text-foreground hover:text-[var(--color-ebrar-green)] transition-colors"
                                            >
                                                Giriş
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="text-sm font-medium text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)] transition-colors"
                                            >
                                                Kayıt Ol
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Row */}
                <nav className="border-t border-border">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center justify-center gap-6 lg:gap-8 py-3 overflow-x-auto">
                            {navItems.map((item) => (
                                <li key={item.label} className="flex-shrink-0">
                                    <Link
                                        to={item.to}
                                        className={`flex items-center gap-1 text-sm font-medium font-serif transition-colors whitespace-nowrap ${item.isHighlighted
                                                ? 'text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)]'
                                                : 'text-foreground hover:text-[var(--color-ebrar-green)]'
                                            }`}
                                    >
                                        {item.label}
                                        {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
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
