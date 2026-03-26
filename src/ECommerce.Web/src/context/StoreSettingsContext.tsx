import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getPublicStoreSettings, defaultHomepageSections, defaultFooterSettings } from '@/features/admin/api/storeSettingsApi';
import type { StoreSettingsDto } from '@/features/admin/api/storeSettingsApi';
import { queryKeys } from '@/utils/queryKeys';
import { useThemeStore } from '@/store/themeStore';
import { hexToRgb, adjustPrimaryForDark, adjustDarkVariant, brandTintedDarkBg } from '@/utils/colorUtils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const FALLBACK_DEFAULTS = import.meta.env.VITE_FALLBACK_DEFAULTS === 'true';

export type SettingsStatus = 'loading' | 'success' | 'error';

// White-label neutral defaults — shown while the query is in flight or on error.
// Matches the backend _defaults palette so there is no flash of wrong color.
const defaults: StoreSettingsDto = {
    imageBase64: undefined,
    storeName: 'Demo Store',
    showStoreNameInHeader: true,
    // area bg colors
    primaryColor: '#2C3E50',
    headerBackgroundColor: '#2C3E50',
    bannerBackgroundColor: '#243342',
    backgroundColor: '#F5F6F7',
    adminSidebarBackgroundColor: '#2C3E50',
    adminPageBackgroundColor: '#F4F6F8',
    // banner
    freeShippingBannerText: 'FREE SHIPPING ON ORDERS OVER $100!',
    freeShippingBannerVisible: false,
    freeShippingBannerMarquee: false,
    freeShippingBannerMarqueeSpeed: 5,
    // pattern
    backgroundPatternBase64: undefined,
    backgroundPatternOpacity: 20,
    // text colors
    navbarActiveColor: '#ECF0F1',
    navbarMenuTextColor: '#ECF0F1',
    storeNameColor: '#FFFFFF',
    avatarTextColor: '#FFFFFF',
    headerIconTextColor: '#ECF0F1',
    bannerTextColor: '#FFFFFF',
    pageTitleColor: '#1F2937',
    productCardCategoryColor: '#6B7280',
    productCardNameColor: '#111827',
    productCardQuantityColor: '#6B7280',
    productCardTotalColor: '#374151',
    productCardPriceColor: '#2C3E50',
    productCardButtonColor: '#2C3E50',
    adminSidebarTextColor: '#ECF0F1',
    adminPageTitleColor: '#2C3E50',
    footerTextColor: '#D1D5DB',
    // fonts
    storeNameFont: 'Arial, Helvetica, sans-serif',
    avatarTextFont: 'Arial, Helvetica, sans-serif',
    headerIconTextFont: 'Arial, Helvetica, sans-serif',
    navbarMenuTextFont: 'Arial, Helvetica, sans-serif',
    bannerTextFont: 'Arial, Helvetica, sans-serif',
    pageTitleFont: 'Arial, Helvetica, sans-serif',
    productCardCategoryFont: 'Arial, Helvetica, sans-serif',
    productCardNameFont: 'Arial, Helvetica, sans-serif',
    productCardQuantityFont: 'Arial, Helvetica, sans-serif',
    productCardTotalFont: 'Arial, Helvetica, sans-serif',
    productCardPriceFont: 'Arial, Helvetica, sans-serif',
    productCardButtonFont: 'Arial, Helvetica, sans-serif',
    adminSidebarTextFont: 'Arial, Helvetica, sans-serif',
    adminPageTitleFont: 'Arial, Helvetica, sans-serif',
    footerTextFont: 'Arial, Helvetica, sans-serif',
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
                title: 'Welcome',
                subtitle: 'Welcome to our store',
                description: 'We offer the finest products at great prices.',
                textColor: '#FFFFFF',
                overlayColor: '#2C3E50',
                overlayOpacity: 85,
                buttonText: 'Start Shopping',
                buttonLink: '/products',
                buttonVisible: true,
            },
            {
                id: 'default-slide-2',
                title: 'Special Offers',
                subtitle: 'Deals on selected products',
                description: "Don't miss out — limited time only.",
                textColor: '#FFFFFF',
                overlayColor: '#1A252F',
                overlayOpacity: 80,
                buttonText: 'Explore Deals',
                buttonLink: '/products',
                buttonVisible: true,
            },
        ],
    },
    homepageSections: defaultHomepageSections,
    footer: defaultFooterSettings,
};

/**
 * Apply brand CSS variables to :root so every component in the tree — including
 * those that cannot call useStoreSettings() (AG Grid theme, DatePicker overrides,
 * global focus-ring CSS) — automatically reflects the store's primary colour.
 *
 * In dark mode the primary colour is automatically adjusted for visibility:
 * lightness is lifted into the 50-65 % range while keeping the original hue,
 * so brand identity is preserved regardless of the admin-chosen hex.
 *
 * Variables set:
 *   --brand-primary         : hex (adjusted for dark mode when active)
 *   --brand-primary-dark    : pressed / 3-D border tone
 *   --brand-primary-light   : 10-15 % opacity rgba  (icon badge bg, grid hover)
 *   --brand-primary-subtle  :  5-8 % opacity rgba   (calendar day hover bg)
 *   --brand-primary-shadow  : 20-25 % opacity rgba  (datepicker selected shadow)
 *   --brand-tinted-dark-bg  : brand-hue-tinted dark bg for sidebar/footer
 *   --brand-surface         : large surface bg (modal headers, panels)
 *                             dark → tinted dark bg, light → primaryColor
 */
function applyBrandCssVars(primaryColor: string, isDark: boolean): void {
    const el = document.documentElement;
    try {
        if (isDark) {
            // Adjust primary for visibility on dark backgrounds
            const adjusted = adjustPrimaryForDark(primaryColor);
            const [ar, ag, ab] = hexToRgb(adjusted);
            const darkVariant = adjustDarkVariant(adjusted);
            const tintedBg = brandTintedDarkBg(primaryColor);

            el.style.setProperty('--brand-primary', adjusted);
            el.style.setProperty('--brand-primary-dark', darkVariant);
            el.style.setProperty('--brand-primary-light', `rgba(${ar},${ag},${ab},0.15)`);
            el.style.setProperty('--brand-primary-subtle', `rgba(${ar},${ag},${ab},0.08)`);
            el.style.setProperty('--brand-primary-shadow', `rgba(${ar},${ag},${ab},0.25)`);
            el.style.setProperty('--brand-tinted-dark-bg', tintedBg);
            el.style.setProperty('--brand-surface', tintedBg);
        } else {
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
            el.style.setProperty('--brand-tinted-dark-bg', primaryColor);
            el.style.setProperty('--brand-surface', primaryColor);
        }
    } catch {
        // Malformed hex — fall back to white-label default
        el.style.setProperty('--brand-primary', defaults.primaryColor);
        el.style.setProperty('--brand-primary-dark', 'rgb(33,46,60)');
        el.style.setProperty('--brand-primary-light', 'rgba(44,62,80,0.10)');
        el.style.setProperty('--brand-primary-subtle', 'rgba(44,62,80,0.05)');
        el.style.setProperty('--brand-primary-shadow', 'rgba(44,62,80,0.20)');
        el.style.setProperty('--brand-tinted-dark-bg', defaults.primaryColor);
        el.style.setProperty('--brand-surface', defaults.primaryColor);
    }
}

// Apply defaults immediately — before first React render — so there is no
// flash of unstyled AG Grids, DatePickers, or focus rings on page load.
applyBrandCssVars(
    defaults.primaryColor,
    document.documentElement.classList.contains('dark'),
);

const StoreSettingsContext = createContext<StoreSettingsDto>(defaults);
const StoreSettingsStatusContext = createContext<SettingsStatus>('loading');

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();

    const { data, isError, isSuccess } = useQuery({
        queryKey: queryKeys.store.settings,
        queryFn: getPublicStoreSettings,
        staleTime: 5 * 60 * 1000, // 5 min — settings rarely change
        retry: 1,
    });

    // After a successful fetch, wait one animation frame so the browser
    // repaints with the updated CSS variables before we un-gate the app.
    const [painted, setPainted] = useState(false);
    useEffect(() => {
        if (!isSuccess) return;
        const raf = requestAnimationFrame(() => setPainted(true));
        return () => cancelAnimationFrame(raf);
    }, [isSuccess]);

    // Derive a three-state status:
    //   loading → API in flight (or success but CSS not yet painted)
    //   success → data loaded & CSS painted, OR mock mode, OR fallback-defaults on error
    //   error   → API failed & fallback-defaults disabled
    let status: SettingsStatus = 'loading';
    if (USE_MOCK) {
        status = 'success';
    } else if (isSuccess && painted) {
        status = 'success';
    } else if (isError) {
        status = FALLBACK_DEFAULTS ? 'success' : 'error';
    }

    const { resolved: theme } = useThemeStore();
    const isDark = theme === 'dark';

    // In mock mode, invalidate all settings caches when language changes so
    // slide content and section titles reflect the new language.
    useEffect(() => {
        if (USE_MOCK) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.store.settings });
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.store });
        }
    }, [i18n.language, queryClient]);

    // Keep CSS variables in sync whenever the DB value or theme changes.
    useEffect(() => {
        applyBrandCssVars(data?.primaryColor ?? defaults.primaryColor, isDark);
    }, [data?.primaryColor, isDark]);

    return (
        <StoreSettingsStatusContext.Provider value={status}>
            <StoreSettingsContext.Provider value={data ?? defaults}>
                {children}
            </StoreSettingsContext.Provider>
        </StoreSettingsStatusContext.Provider>
    );
}

export function useStoreSettings(): StoreSettingsDto {
    return useContext(StoreSettingsContext);
}

/** Returns the three-state loading status of store settings. */
export function useStoreSettingsStatus(): SettingsStatus {
    return useContext(StoreSettingsStatusContext);
}

/** Returns true once store settings are ready to render (backward-compat). */
export function useStoreSettingsReady(): boolean {
    return useContext(StoreSettingsStatusContext) !== 'loading';
}
