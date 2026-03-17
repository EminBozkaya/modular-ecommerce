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

export type TextPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type BadgePosition = 'top-left' | 'top-right';
export type LinkType = 'product' | 'category' | 'url' | 'none';
export type AspectRatio = 'square' | 'landscape' | 'portrait' | 'auto';
export type SectionLayout = 'grid' | 'featured' | 'banner' | 'carousel' | 'masonry' | 'clover' | 'collage';

export interface SectionCardDto {
    id: string;
    imageBase64?: string;
    imageUrl?: string;
    title: string;
    subtitle: string;
    description: string;
    textPosition: TextPosition;
    textColor: string;
    overlayColor: string;
    overlayOpacity: number;
    badgeText?: string;
    badgeColor?: string;
    badgePosition: BadgePosition;
    linkType: LinkType;
    linkTarget?: string;
    buttonText?: string;
    buttonVisible: boolean;
    aspectRatio: AspectRatio;
    colSpan: number;
    rowSpan: number;
}

export interface HomepageSectionDto {
    id: string;
    title: string;
    showTitle: boolean;
    layout: SectionLayout;
    columns: number;
    backgroundColor: string;
    paddingY: number;
    order: number;
    enabled: boolean;
    cards: SectionCardDto[];
}

// ── Footer Types ──────────────────────────────────────────────────────────────
export type FooterColumnType = 'links' | 'contact' | 'social' | 'about';
export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok' | 'whatsapp';
export type FooterBottomAlignment = 'left' | 'center' | 'between';

export interface FooterLinkDto {
    id: string;
    label: string;
    url: string;
    order: number;
}

export interface FooterSocialLinkDto {
    id: string;
    platform: SocialPlatform;
    url: string;
}

export interface FooterColumnDto {
    id: string;
    type: FooterColumnType;
    title: string;
    order: number;
    enabled: boolean;
    links?: FooterLinkDto[];
    address?: string;
    phone?: string;
    email?: string;
    socialLinks?: FooterSocialLinkDto[];
    followText?: string;
    showLogo?: boolean;
    description?: string;
}

export interface FooterBottomLinkDto {
    id: string;
    label: string;
    url: string;
    order: number;
}

export interface FooterSettingsDto {
    columns: FooterColumnDto[];
    backgroundColor?: string;
    textColor?: string;
    copyrightText: string;
    bottomBarAlignment: FooterBottomAlignment;
    bottomLinks: FooterBottomLinkDto[];
}

export interface StoreSettingsDto {
    // Brand identity
    imageBase64?: string;
    storeName: string;
    showStoreNameInHeader: boolean;

    // Area / section background colors
    primaryColor: string;
    headerBackgroundColor: string;
    bannerBackgroundColor: string;
    backgroundColor: string;
    adminSidebarBackgroundColor: string;
    adminPageBackgroundColor: string;

    // Banner / marquee
    freeShippingBannerText: string;
    freeShippingBannerVisible: boolean;
    freeShippingBannerMarquee: boolean;
    freeShippingBannerMarqueeSpeed: number;

    // Background pattern
    backgroundPatternBase64?: string;
    backgroundPatternOpacity: number;

    // Text colors
    navbarActiveColor: string;
    navbarMenuTextColor: string;
    storeNameColor: string;
    avatarTextColor: string;
    headerIconTextColor: string;
    bannerTextColor: string;
    pageTitleColor: string;
    productCardCategoryColor: string;
    productCardNameColor: string;
    productCardQuantityColor: string;
    productCardTotalColor: string;
    productCardPriceColor: string;
    productCardButtonColor: string;
    adminSidebarTextColor: string;
    adminPageTitleColor: string;
    footerTextColor: string;

    // Text fonts (system / cross-browser fonts)
    storeNameFont: string;
    avatarTextFont: string;
    headerIconTextFont: string;
    navbarMenuTextFont: string;
    bannerTextFont: string;
    pageTitleFont: string;
    productCardCategoryFont: string;
    productCardNameFont: string;
    productCardQuantityFont: string;
    productCardTotalFont: string;
    productCardPriceFont: string;
    productCardButtonFont: string;
    adminSidebarTextFont: string;
    adminPageTitleFont: string;
    footerTextFont: string;

    // Rich content
    heroCarousel: HeroCarouselDto;
    homepageSections: HomepageSectionDto[];
    footer: FooterSettingsDto;
}

export type UpdateStoreSettingsRequest = StoreSettingsDto;

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Default homepage sections — replicates the original hardcoded layout */
export const defaultHomepageSections: HomepageSectionDto[] = [
    {
        id: 'default-categories',
        title: 'Ana Kategoriler',
        showTitle: false,
        layout: 'grid',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 48,
        order: 0,
        enabled: true,
        cards: [
            { id: 'cat-1', imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400&h=300&fit=crop', title: 'KURU MEYVE', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=4', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'cat-2', imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=300&fit=crop', title: 'KURUYEMİŞ', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=1', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'cat-3', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop', title: 'ATIŞTIYRMALIK & MİX', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=5', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-featured',
        title: 'Öne Çıkan Ürünler',
        showTitle: false,
        layout: 'featured',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 32,
        order: 1,
        enabled: true,
        cards: [
            { id: 'feat-1', imageUrl: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=400&h=500&fit=crop', title: 'HAFTANIN FIRSATI', subtitle: 'Türk Kayısısı & Çekirdekli Hurma', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 40, badgeText: 'İndirimli', badgeColor: '#D4A853', badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'ALIŞVERİŞ YAP', buttonVisible: true, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'feat-2', imageUrl: 'https://images.unsplash.com/photo-1574570173583-a65fc27484be?w=400&h=300&fit=crop', title: 'ÜYELİK KULÜBÜ', subtitle: 'Her ay kapınıza özel seçilmiş kuruyemiş paketi.', description: '', textPosition: 'center', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 40, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'KATIL', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'feat-3', imageUrl: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=200&fit=crop', title: 'TOHUMLAR', subtitle: 'Çeşit Çeşit Tohumlar', description: '', textPosition: 'top-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 35, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'ALIŞVERİŞ YAP', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'feat-4', imageUrl: 'https://images.unsplash.com/photo-1513135065346-a098a63a71ee?w=400&h=200&fit=crop', title: 'HEDİYELER', subtitle: 'Hediye için ihtiyacınız olan her şey!', description: '', textPosition: 'top-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 35, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'ALIŞVERİŞ YAP', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-satisfaction',
        title: '%100 MEMNUNİYET GARANTİSİ',
        showTitle: false,
        layout: 'banner',
        columns: 1,
        backgroundColor: 'transparent',
        paddingY: 80,
        order: 2,
        enabled: true,
        cards: [
            { id: 'banner-1', imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1920&h=600&fit=crop', title: '%100 MEMNUNİYET GARANTİSİ', subtitle: '', description: 'Müşterilerimize Badem, Ceviz, Fıstık ve Fındık dahil en taze toptan kuruyemişleri sunuyoruz. Kabuklu ya da kabuksuz, en kaliteli ürünler burada.', textPosition: 'center', textColor: '#FFFFFF', overlayColor: '#2C3E50', overlayOpacity: 85, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'DAHA FAZLA BİLGİ', buttonVisible: true, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-news',
        title: 'HABERLER & İPUÇLARI',
        showTitle: true,
        layout: 'grid',
        columns: 2,
        backgroundColor: 'transparent',
        paddingY: 64,
        order: 3,
        enabled: true,
        cards: [
            { id: 'news-1', imageUrl: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=200&h=200&fit=crop', title: 'ŞİMDİ İNDİRİMDE!', subtitle: '', description: 'Kuru Kayısı & Çekirdekli Hurma\'da özel indirim – Sınırlı süre! Premium kalite ürünlerimizi kaçırmayın...', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonText: 'DEVAMINI OKU', buttonVisible: true, aspectRatio: 'square', colSpan: 1, rowSpan: 1 },
            { id: 'news-2', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop', title: 'YENİ ŞUBE', subtitle: '', description: 'Yeni şubemizi ziyaret edin! Daha geniş ürün yelpazesi ve kolay erişim ile hizmetinizdeyiz...', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonText: 'DEVAMINI OKU', buttonVisible: true, aspectRatio: 'square', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-testimonials',
        title: 'MÜŞTERİLERİMİZ NE DİYOR?',
        showTitle: true,
        layout: 'grid',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 64,
        order: 4,
        enabled: true,
        cards: [
            { id: 'test-1', title: 'Ayşe Y.', subtitle: 'İstanbul', description: 'Harika ürünler. Zamanında teslim edildi. Hediye kutusunu çok beğendik! Teşekkürler!', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'test-2', title: 'Mehmet K.', subtitle: 'Ankara', description: 'İlk kez sipariş verdim ve artık sürekli müşteriyim! Mango dilimleri muhteşem.', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'test-3', title: 'Fatma C.', subtitle: 'İzmir', description: 'Yıl boyunca kabuklu kuruyemiş bulabilmek harika. Kuruyemişlerinizi çok seviyorum, TEŞEKKÜRLER!', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
        ],
    },
];

/** Default footer settings — replicates the original hardcoded footer */
export const defaultFooterSettings: FooterSettingsDto = {
    columns: [
        {
            id: 'footer-col-1',
            type: 'links',
            title: 'HAKKIMIZDA',
            order: 0,
            enabled: true,
            links: [
                { id: 'fl-1', label: 'Referanslar', url: '#', order: 0 },
                { id: 'fl-2', label: 'SSS', url: '#', order: 1 },
                { id: 'fl-3', label: 'Müşteri Hizmetleri', url: '#', order: 2 },
            ],
        },
        {
            id: 'footer-col-2',
            type: 'links',
            title: 'HABERLER & İPUÇLARI',
            order: 1,
            enabled: true,
            links: [
                { id: 'fl-4', label: 'Kuruyemiş Haberleri', url: '#', order: 0 },
                { id: 'fl-5', label: 'Bilgi Köşesi', url: '#', order: 1 },
                { id: 'fl-6', label: 'Tarifler', url: '#', order: 2 },
            ],
        },
        {
            id: 'footer-col-3',
            type: 'contact',
            title: 'İLETİŞİM',
            order: 2,
            enabled: true,
            phone: '0212 555 00 00',
            address: 'Atatürk Caddesi No: 42\nİstanbul, Türkiye',
        },
        {
            id: 'footer-col-4',
            type: 'social',
            title: 'SOSYAL MEDYA',
            order: 3,
            enabled: true,
            followText: 'Bizi takip edin:',
            socialLinks: [
                { id: 'fsl-1', platform: 'facebook', url: '#' },
                { id: 'fsl-2', platform: 'twitter', url: '#' },
                { id: 'fsl-3', platform: 'instagram', url: '#' },
            ],
        },
    ],
    copyrightText: 'Tüm hakları saklıdır.',
    bottomBarAlignment: 'between',
    bottomLinks: [
        { id: 'fbl-1', label: 'Kullanım Şartları', url: '#', order: 0 },
        { id: 'fbl-2', label: 'Gizlilik Politikası', url: '#', order: 1 },
        { id: 'fbl-3', label: 'Yasal Uyarı', url: '#', order: 2 },
    ],
};

// Mock simulates what the backend returns when VITE_USE_MOCK_API=true.
// Uses the same white-label neutral defaults as the backend query handler
// so developers see a realistic "fresh install" state during local dev.
const _mockSettings: StoreSettingsDto = {
    // Brand
    imageBase64: undefined,
    storeName: 'Mağazam',
    showStoreNameInHeader: true,
    // Area bg colors
    primaryColor: '#2C3E50',
    headerBackgroundColor: '#2C3E50',
    bannerBackgroundColor: '#243342',
    backgroundColor: '#F5F6F7',
    adminSidebarBackgroundColor: '#2C3E50',
    adminPageBackgroundColor: '#F4F6F8',
    // Banner
    freeShippingBannerText: 'Hızlı ve güvenli teslimat garantisiyle alışveriş yapın!',
    freeShippingBannerVisible: false,
    freeShippingBannerMarquee: false,
    freeShippingBannerMarqueeSpeed: 5,
    // Pattern
    backgroundPatternBase64: undefined,
    backgroundPatternOpacity: 20,
    // Text colors
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
    // Fonts
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
    homepageSections: defaultHomepageSections,
    footer: defaultFooterSettings,
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
