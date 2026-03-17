import { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicStoreSettings } from '@/features/admin/api/storeSettingsApi';
import type { StoreSettingsDto } from '@/features/admin/api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';

// White-label neutral defaults — shown while the query is in flight or on error.
// Matches the backend _defaults palette so there is no flash of wrong color.
const defaults: StoreSettingsDto = {
    imageBase64: undefined,
    storeName: 'Mağazam',
    showStoreNameInHeader: true,
    primaryColor: '#2C3E50',
    navbarActiveColor: '#ECF0F1',
    freeShippingBannerText: 'Hızlı ve güvenli teslimat garantisiyle alışveriş yapın!',
    freeShippingBannerVisible: false,
    freeShippingBannerMarquee: false,
    freeShippingBannerMarqueeSpeed: 5,
    backgroundPatternBase64: undefined,
    backgroundPatternOpacity: 20,
    backgroundColor: '#F5F6F7',
    heroCarousel: {
        enabled: true,
        effect: 'slide',
        height: 500,
        autoPlay: true,
        autoPlayInterval: 5000,
        loop: true,
        showArrows: true,
        showDots: true,
        slides: [
            {
                id: 'default-slide-1',
                title: 'Hoş Geldiniz',
                subtitle: 'Mağazamıza hoş geldiniz',
                description: 'En kaliteli ürünleri uygun fiyatlarla sunuyoruz.',
                textColor: '#FFFFFF',
                overlayColor: '#2C3E50',
                overlayOpacity: 85,
                buttonText: 'Alışverişe Başla',
                buttonLink: '/products',
                buttonVisible: true,
            },
            {
                id: 'default-slide-2',
                title: 'Özel Kampanyalar',
                subtitle: 'Seçili ürünlerde fırsatlar',
                description: 'Kaçırmayın, sınırlı süre geçerlidir.',
                textColor: '#FFFFFF',
                overlayColor: '#1A252F',
                overlayOpacity: 80,
                buttonText: 'Fırsatları Keşfet',
                buttonLink: '/products',
                buttonVisible: true,
            },
        ],
    },
};

/**
 * Parse a #RRGGBB hex string to [r, g, b].
 * Falls back to white-label defaults on any parse error.
 */
function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

/**
 * Apply brand CSS variables to :root so every component in the tree — including
 * those that cannot call useStoreSettings() (AG Grid theme, DatePicker overrides,
 * global focus-ring CSS) — automatically reflects the store's primary colour.
 *
 * Variables set:
 *   --brand-primary         : the hex value itself
 *   --brand-primary-light   : 10 % opacity rgba  (icon badge bg, grid hover)
 *   --brand-primary-subtle  : 5 % opacity rgba   (calendar day hover bg)
 *   --brand-primary-shadow  : 20 % opacity rgba  (datepicker selected shadow)
 */
function applyBrandCssVars(primaryColor: string): void {
    const el = document.documentElement;
    try {
        const [r, g, b] = hexToRgb(primaryColor);
        // 75 % brightness for the "pressed" / 3-D-button border-bottom dark tone
        const dr = Math.round(r * 0.75);
        const dg = Math.round(g * 0.75);
        const db = Math.round(b * 0.75);
        el.style.setProperty('--brand-primary', primaryColor);
        el.style.setProperty('--brand-primary-dark', `rgb(${dr},${dg},${db})`);
        el.style.setProperty('--brand-primary-light', `rgba(${r},${g},${b},0.10)`);
        el.style.setProperty('--brand-primary-subtle', `rgba(${r},${g},${b},0.05)`);
        el.style.setProperty('--brand-primary-shadow', `rgba(${r},${g},${b},0.20)`);
    } catch {
        // Malformed hex — fall back to white-label default
        el.style.setProperty('--brand-primary', defaults.primaryColor);
        el.style.setProperty('--brand-primary-dark', 'rgb(33,46,60)');
        el.style.setProperty('--brand-primary-light', 'rgba(44,62,80,0.10)');
        el.style.setProperty('--brand-primary-subtle', 'rgba(44,62,80,0.05)');
        el.style.setProperty('--brand-primary-shadow', 'rgba(44,62,80,0.20)');
    }
}

// Apply defaults immediately — before first React render — so there is no
// flash of unstyled AG Grids, DatePickers, or focus rings on page load.
applyBrandCssVars(defaults.primaryColor);

const StoreSettingsContext = createContext<StoreSettingsDto>(defaults);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
    const { data } = useQuery({
        queryKey: queryKeys.store.settings,
        queryFn: getPublicStoreSettings,
        staleTime: 5 * 60 * 1000, // 5 min — settings rarely change
        retry: 1,
    });

    // Keep CSS variables in sync whenever the DB value arrives or changes.
    useEffect(() => {
        applyBrandCssVars(data?.primaryColor ?? defaults.primaryColor);
    }, [data?.primaryColor]);

    return (
        <StoreSettingsContext.Provider value={data ?? defaults}>
            {children}
        </StoreSettingsContext.Provider>
    );
}

export function useStoreSettings(): StoreSettingsDto {
    return useContext(StoreSettingsContext);
}
