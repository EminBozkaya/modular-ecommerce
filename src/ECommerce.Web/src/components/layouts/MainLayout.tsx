import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './header/AppHeader';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { Footer } from '@/features/catalog/components/Footer';
import { useThemeStore } from '@/store/themeStore';

export function MainLayout() {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const settings = useStoreSettings();
    const { resolved } = useThemeStore();

    const bgPatternStyle = settings.backgroundPatternBase64
        ? {
              backgroundImage: `url(${settings.backgroundPatternBase64})`,
              opacity: settings.backgroundPatternOpacity / 100,
          }
        : undefined;

    // In dark mode, let CSS variables handle the background (don't override with light admin color)
    const bgStyle = resolved === 'dark' ? undefined : { backgroundColor: settings.backgroundColor };

    return (
        <div
            className="relative min-h-screen flex flex-col bg-background"
            style={bgStyle}
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
            {!isAuthPage && <Footer />}

        </div>
    );
}
