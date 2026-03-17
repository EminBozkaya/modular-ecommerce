import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Phone,
    Clock,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
} from 'lucide-react';
import { AppHeader } from './header/AppHeader';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export function MainLayout() {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const settings = useStoreSettings();

    const bgPatternStyle = settings.backgroundPatternBase64
        ? {
              backgroundImage: `url(${settings.backgroundPatternBase64})`,
              opacity: settings.backgroundPatternOpacity / 100,
          }
        : undefined;

    return (
        <div
            className="relative min-h-screen flex flex-col"
            style={{ backgroundColor: settings.backgroundColor }}
        >
            {/* Background pattern layer — opacity only affects the image */}
            {bgPatternStyle && (
                <div
                    className="fixed inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0"
                    style={bgPatternStyle}
                />
            )}

            {!isAuthPage && <AppHeader />}

            {/* Free Shipping Banner */}
            {!isAuthPage && settings.freeShippingBannerVisible && (
                <div
                    className="relative z-10 py-2 overflow-hidden"
                    style={{ backgroundColor: settings.primaryColor }}
                >
                    {settings.freeShippingBannerMarquee ? (
                        <div
                            className="animate-marquee-track text-sm font-medium text-white tracking-wide"
                            style={{ animationDuration: `${(11 - settings.freeShippingBannerMarqueeSpeed) * 3}s` }}
                        >
                            {settings.freeShippingBannerText}
                        </div>
                    ) : (
                        <p className="text-center text-sm font-medium text-white tracking-wide">
                            {settings.freeShippingBannerText}
                        </p>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            {!isAuthPage && (
                <footer
                    className="relative z-10 text-white"
                    style={{ backgroundColor: settings.primaryColor }}
                >
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto text-center lg:text-left">
                            <div>
                                <h3 className="font-semibold mb-4 text-white">HAKKIMIZDA</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li><a href="#" className="hover:text-white transition-colors">Referanslar</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Musteri Hizmetleri</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4 text-white">HABERLER &amp; IPUCLARI</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li><a href="#" className="hover:text-white transition-colors">Kuruyemis Haberleri</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Bilgi Kosesi</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Tarifler</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4 text-white">ILETISIM</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li><a href="#" className="hover:text-white transition-colors">Siparislerim</a></li>
                                    <li>
                                        <Link to="/products" className="hover:text-white transition-colors">
                                            Tum Urunler
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <ul className="space-y-3 text-sm text-white/80">
                                    <li className="flex items-center gap-2 justify-center lg:justify-start">
                                        <Phone className="h-4 w-4" />
                                        <span>0212 555 00 00</span>
                                    </li>
                                    <li className="flex items-center gap-2 justify-center lg:justify-start">
                                        <Clock className="h-4 w-4" />
                                        <span>09:00 - 18:00 Pts - Cum</span>
                                    </li>
                                    <li className="flex items-start gap-2 justify-center lg:justify-start">
                                        <MapPin className="h-4 w-4 mt-0.5" />
                                        <span>Ataturk Caddesi No: 42<br />Istanbul, Turkiye</span>
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

                    <div className="border-t border-white/20">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
                                <p>&copy; 2026 {settings.storeName}. Tum haklari saklidir.</p>
                                <div className="flex items-center gap-4">
                                    <a href="#" className="hover:text-white transition-colors">Kullanim Sartlari</a>
                                    <span>|</span>
                                    <a href="#" className="hover:text-white transition-colors">Gizlilik Politikasi</a>
                                    <span>|</span>
                                    <a href="#" className="hover:text-white transition-colors">Yasal Uyari</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

        </div>
    );
}
