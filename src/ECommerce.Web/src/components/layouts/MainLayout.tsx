import { useState, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppHeader } from './header/AppHeader';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { Footer } from '@/features/catalog/components/Footer';
import { useThemeStore } from '@/store/themeStore';
import { getLocalizedText } from '@/features/admin/api/storeSettingsApi';

export function MainLayout() {
    const { i18n } = useTranslation();
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const settings = useStoreSettings();
    const { resolved } = useThemeStore();
    const { i18n: i18n_obj } = useTranslation();

    // Constant speed marquee logic
    const [marqueeDuration, setMarqueeDuration] = useState(30);
    const trackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (settings.freeShippingBannerMarquee && trackRef.current) {
            const updateDuration = () => {
                const width = trackRef.current?.offsetWidth || 0;
                const pixelsPerSecond = (settings.freeShippingBannerMarqueeSpeed * 20) + 40;
                if (width > 0) setMarqueeDuration(width / pixelsPerSecond);
            };
            updateDuration();
            const observer = new ResizeObserver(updateDuration);
            observer.observe(trackRef.current);
            return () => observer.disconnect();
        }
    }, [settings.freeShippingBannerMarquee, settings.freeShippingBannerMarqueeSpeed, settings.freeShippingBannerText, i18n_obj.language]);

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
                    style={{ backgroundColor: resolved === 'dark' ? 'var(--brand-tinted-dark-bg)' : settings.primaryColor }}
                >
                    {settings.freeShippingBannerMarquee ? (
                        <div
                            ref={trackRef}
                            className={`animate-marquee-track text-sm font-medium text-white tracking-wide ${i18n_obj.language === 'ar' ? 'rtl' : ''}`}
                            style={{ animationDuration: `${marqueeDuration}s` }}
                        >
                            {getLocalizedText(settings, 'freeShippingBannerText', i18n.language)}
                        </div>
                    ) : (
                        <p className="text-center text-sm font-medium text-white tracking-wide">
                            {getLocalizedText(settings, 'freeShippingBannerText', i18n.language)}
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
