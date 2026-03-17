import { apiClient } from '../../../api/client';

export interface HeroSlideDto {
    id: string;
    imageBase64?: string;
    imageUrl?: string;
    title: string;
    subtitle: string;
    description: string;
    textColor: string;
    overlayColor: string;
    overlayOpacity: number; // 0–100
    buttonText: string;
    buttonLink: string;
    buttonVisible: boolean;
}

export interface HeroCarouselDto {
    enabled: boolean;
    effect: 'slide' | 'fade' | 'coverflow' | 'flip';
    height: number; // px
    autoPlay: boolean;
    autoPlayInterval: number; // ms
    loop: boolean;
    showArrows: boolean;
    showDots: boolean;
    slides: HeroSlideDto[];
}

export interface StoreSettingsDto {
    imageBase64?: string;
    storeName: string;
    showStoreNameInHeader: boolean;
    primaryColor: string;
    navbarActiveColor: string;
    freeShippingBannerText: string;
    freeShippingBannerVisible: boolean;
    freeShippingBannerMarquee: boolean;
    freeShippingBannerMarqueeSpeed: number;
    backgroundPatternBase64?: string;
    backgroundPatternOpacity: number;
    backgroundColor: string;
    heroCarousel: HeroCarouselDto;
}

export type UpdateStoreSettingsRequest = StoreSettingsDto;

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// Mock simulates what the backend returns when VITE_USE_MOCK_API=true.
// Uses the same white-label neutral defaults as the backend query handler
// so developers see a realistic "fresh install" state during local dev.
const _mockSettings: StoreSettingsDto = {
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
                id: 'mock-slide-1',
                imageBase64: undefined,
                imageUrl: undefined,
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
                id: 'mock-slide-2',
                imageBase64: undefined,
                imageUrl: undefined,
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

/** Admin-only: GET /api/admin/store-settings */
export async function getAdminStoreSettings(): Promise<StoreSettingsDto> {
    if (USE_MOCK) return { ..._mockSettings };
    const res = await apiClient.get<StoreSettingsDto>('/api/admin/store-settings');
    return res.data;
}

/** Admin-only: PUT /api/admin/store-settings */
export async function updateStoreSettings(data: UpdateStoreSettingsRequest): Promise<void> {
    if (USE_MOCK) {
        Object.assign(_mockSettings, data);
        return;
    }
    await apiClient.put('/api/admin/store-settings', data);
}

/** Public: GET /api/store/settings — used by storefront layouts */
export async function getPublicStoreSettings(): Promise<StoreSettingsDto> {
    if (USE_MOCK) return { ..._mockSettings };
    const res = await apiClient.get<StoreSettingsDto>('/api/store/settings');
    return res.data;
}
