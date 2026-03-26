import i18next from 'i18next';
import { apiClient } from '../../../api/client';

export type TranslationsMap = Record<string, Record<string, string>>;

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
    translations?: TranslationsMap;
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
    translations?: TranslationsMap;
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
    translations?: TranslationsMap;
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
    translations?: TranslationsMap;
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
    translations?: TranslationsMap;
}

export interface FooterBottomLinkDto {
    id: string;
    label: string;
    url: string;
    order: number;
    translations?: TranslationsMap;
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
    translations?: TranslationsMap;
}

export type UpdateStoreSettingsRequest = StoreSettingsDto;

/**
 * Helper to get localized text from any DTO that has a `translations` map.
 * If the current language has a translation for the field, it returns that.
 * Otherwise, it falls back to the default field value on the object.
 */
/**
 * Helper to get localized text from any DTO that has a `translations` map.
 * If the current language has a translation for the field, it returns that.
 * Otherwise, it falls back to the default field value on the object.
 */
export function getLocalizedText<T extends { translations?: TranslationsMap }>(
    obj: T,
    field: keyof T,
    langCode?: string
): string {
    const defaultVal = (obj[field] as unknown as string) || '';
    
    // Use provided langCode or fall back to current i18next language
    const currentLang = langCode || i18next.language || 'tr';
    if (!obj.translations) return defaultVal;

    // Use just the language part e.g. 'en' from 'en-US'
    const shortLang = currentLang.split('-')[0].toLowerCase();
    
    // Check main lang
    const translationsForLang = obj.translations[shortLang];
    if (translationsForLang && translationsForLang[field as string]) {
        return translationsForLang[field as string];
    }
    
    // Fallback to literal object value
    return defaultVal;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Default homepage sections — replicates the original hardcoded layout */
export const defaultHomepageSections: HomepageSectionDto[] = [
    {
        id: 'default-categories',
        title: 'Main Categories',
        showTitle: false,
        layout: 'grid',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 48,
        order: 0,
        enabled: true,
        cards: [
            { id: 'cat-1', imageUrl: 'https://picsum.photos/seed/cat-a/400/300', title: 'CATEGORY A', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=1', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'cat-2', imageUrl: 'https://picsum.photos/seed/cat-b/400/300', title: 'CATEGORY B', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=2', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'cat-3', imageUrl: 'https://picsum.photos/seed/cat-c/400/300', title: 'CATEGORY C', subtitle: '', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 30, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products?categoryId=3', buttonVisible: false, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-featured',
        title: 'Featured Products',
        showTitle: false,
        layout: 'featured',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 32,
        order: 1,
        enabled: true,
        cards: [
            { id: 'feat-1', imageUrl: 'https://picsum.photos/seed/featured-1/400/500', title: 'WEEKLY DEAL', subtitle: 'Special discounts on selected products.', description: '', textPosition: 'bottom-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 40, badgeText: 'Sale', badgeColor: '#D4A853', badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'SHOP NOW', buttonVisible: true, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'feat-2', imageUrl: 'https://picsum.photos/seed/featured-2/400/300', title: 'NEW ARRIVALS', subtitle: 'Discover the latest additions to our collection.', description: '', textPosition: 'center', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 40, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'EXPLORE', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'feat-3', imageUrl: 'https://picsum.photos/seed/featured-3/400/200', title: 'BEST SELLERS', subtitle: 'Our most popular products.', description: '', textPosition: 'top-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 35, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'SHOP NOW', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
            { id: 'feat-4', imageUrl: 'https://picsum.photos/seed/featured-4/400/200', title: 'GIFTS', subtitle: 'Perfect gift ideas for your loved ones!', description: '', textPosition: 'top-left', textColor: '#FFFFFF', overlayColor: '#000000', overlayOpacity: 35, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'SHOP NOW', buttonVisible: true, aspectRatio: 'landscape', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-satisfaction',
        title: '100% SATISFACTION GUARANTEE',
        showTitle: false,
        layout: 'banner',
        columns: 1,
        backgroundColor: 'transparent',
        paddingY: 80,
        order: 2,
        enabled: true,
        cards: [
            { id: 'banner-1', imageUrl: 'https://picsum.photos/seed/banner-1/1920/600', title: '100% SATISFACTION GUARANTEE', subtitle: '', description: 'We are committed to providing the highest quality products and services. If you are not satisfied, we will make it right.', textPosition: 'center', textColor: '#FFFFFF', overlayColor: '#2C3E50', overlayOpacity: 85, badgePosition: 'top-left', linkType: 'url', linkTarget: '/products', buttonText: 'LEARN MORE', buttonVisible: true, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-news',
        title: 'NEWS & TIPS',
        showTitle: true,
        layout: 'grid',
        columns: 2,
        backgroundColor: 'transparent',
        paddingY: 64,
        order: 3,
        enabled: true,
        cards: [
            { id: 'news-1', imageUrl: 'https://picsum.photos/seed/news-1/200/200', title: 'ON SALE NOW!', subtitle: '', description: 'Special discounts on selected products. Limited time offer — don\'t miss out!', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonText: 'READ MORE', buttonVisible: true, aspectRatio: 'square', colSpan: 1, rowSpan: 1 },
            { id: 'news-2', imageUrl: 'https://picsum.photos/seed/news-2/200/200', title: 'NEW COLLECTION', subtitle: '', description: 'Check out our latest products and expanded range of items now available.', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonText: 'READ MORE', buttonVisible: true, aspectRatio: 'square', colSpan: 1, rowSpan: 1 },
        ],
    },
    {
        id: 'default-testimonials',
        title: 'WHAT OUR CUSTOMERS SAY',
        showTitle: true,
        layout: 'grid',
        columns: 3,
        backgroundColor: 'transparent',
        paddingY: 64,
        order: 4,
        enabled: true,
        cards: [
            { id: 'test-1', title: 'Alex M.', subtitle: 'Berlin', description: 'Great products and fast delivery. Very satisfied, thank you!', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'test-2', title: 'Sarah L.', subtitle: 'London', description: 'Product quality exceeded my expectations. Will definitely order again.', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
            { id: 'test-3', title: 'Yuki T.', subtitle: 'Tokyo', description: 'Excellent customer service. Products arrived on time and without any issues.', textPosition: 'center', textColor: '#333333', overlayColor: '#000000', overlayOpacity: 0, badgePosition: 'top-left', linkType: 'none', buttonVisible: false, aspectRatio: 'auto', colSpan: 1, rowSpan: 1 },
        ],
    },
];

/** Default footer settings — replicates the original hardcoded footer */
export const defaultFooterSettings: FooterSettingsDto = {
    columns: [
        {
            id: 'footer-col-1',
            type: 'links',
            title: 'ABOUT US',
            order: 0,
            enabled: true,
            links: [
                { id: 'fl-1', label: 'References', url: '#', order: 0 },
                { id: 'fl-2', label: 'FAQ', url: '#', order: 1 },
                { id: 'fl-3', label: 'Customer Service', url: '#', order: 2 },
            ],
        },
        {
            id: 'footer-col-2',
            type: 'links',
            title: 'NEWS & TIPS',
            order: 1,
            enabled: true,
            links: [
                { id: 'fl-4', label: 'Latest News', url: '#', order: 0 },
                { id: 'fl-5', label: 'Knowledge Base', url: '#', order: 1 },
                { id: 'fl-6', label: 'Guides', url: '#', order: 2 },
            ],
        },
        {
            id: 'footer-col-3',
            type: 'contact',
            title: 'CONTACT',
            order: 2,
            enabled: true,
            phone: '+1 (555) 000-0000',
            address: '123 Main Street\nNew York, NY 10001',
        },
        {
            id: 'footer-col-4',
            type: 'social',
            title: 'SOCIAL MEDIA',
            order: 3,
            enabled: true,
            followText: 'Follow us:',
            socialLinks: [
                { id: 'fsl-1', platform: 'facebook', url: '#' },
                { id: 'fsl-2', platform: 'twitter', url: '#' },
                { id: 'fsl-3', platform: 'instagram', url: '#' },
            ],
        },
    ],
    copyrightText: 'All rights reserved.',
    bottomBarAlignment: 'between',
    bottomLinks: [
        { id: 'fbl-1', label: 'Terms of Use', url: '#', order: 0 },
        { id: 'fbl-2', label: 'Privacy Policy', url: '#', order: 1 },
        { id: 'fbl-3', label: 'Legal Notice', url: '#', order: 2 },
    ],
};

/** Language-aware footer column title translations for mock mode */
const FOOTER_COL_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
    'footer-col-1': { tr: 'HAKKIMIZDA', en: 'ABOUT US', de: 'ÜBER UNS', fr: 'À PROPOS', es: 'SOBRE NOSOTROS', ru: 'О НАС', ar: 'من نحن' },
    'footer-col-2': { tr: 'HABERLER & İPUÇLARI', en: 'NEWS & TIPS', de: 'NEUIGKEITEN & TIPPS', fr: 'ACTUALITÉS & CONSEILS', es: 'NOTICIAS Y CONSEJOS', ru: 'НОВОСТИ И СОВЕТЫ', ar: 'أخبار ونصائح' },
    'footer-col-3': { tr: 'İLETİŞİM', en: 'CONTACT', de: 'KONTAKT', fr: 'CONTACT', es: 'CONTACTO', ru: 'КОНТАКТЫ', ar: 'اتصل بنا' },
    'footer-col-4': { tr: 'SOSYAL MEDYA', en: 'SOCIAL MEDIA', de: 'SOZIALE MEDIEN', fr: 'RÉSEAUX SOCIAUX', es: 'REDES SOCIALES', ru: 'СОЦИАЛЬНЫЕ СЕТИ', ar: 'التواصل الاجتماعي' },
};

const FOOTER_BOTTOM_LINK_TRANSLATIONS: Record<string, Record<string, string>> = {
    'fbl-1': { tr: 'Kullanım Şartları', en: 'Terms of Use', de: 'Nutzungsbedingungen', fr: "Conditions d'utilisation", es: 'Términos de uso', ru: 'Условия использования', ar: 'شروط الاستخدام' },
    'fbl-2': { tr: 'Gizlilik Politikası', en: 'Privacy Policy', de: 'Datenschutzrichtlinie', fr: 'Politique de confidentialité', es: 'Política de privacidad', ru: 'Политика конфиденциальности', ar: 'سياسة الخصوصية' },
    'fbl-3': { tr: 'Yasal Uyarı', en: 'Legal Notice', de: 'Rechtlicher Hinweis', fr: 'Mentions légales', es: 'Aviso legal', ru: 'Юридическое уведомление', ar: 'إشعار قانوني' },
};

function getMockFooter(): FooterSettingsDto {
    const lang = i18next.language?.split('-')[0] ?? 'en';
    return {
        ...defaultFooterSettings,
        columns: defaultFooterSettings.columns.map(col => ({
            ...col,
            title: FOOTER_COL_TITLE_TRANSLATIONS[col.id]?.[lang]
                ?? FOOTER_COL_TITLE_TRANSLATIONS[col.id]?.['en']
                ?? col.title,
        })),
        bottomLinks: defaultFooterSettings.bottomLinks.map(link => ({
            ...link,
            label: FOOTER_BOTTOM_LINK_TRANSLATIONS[link.id]?.[lang]
                ?? FOOTER_BOTTOM_LINK_TRANSLATIONS[link.id]?.['en']
                ?? link.label,
        })),
    };
}

/** Language-aware section title translations for mock mode */
const SECTION_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
    'default-categories': { tr: 'Ana Kategoriler', en: 'Main Categories', de: 'Hauptkategorien', fr: 'Catégories Principales', es: 'Categorías Principales', ru: 'Основные категории', ar: 'الفئات الرئيسية' },
    'default-featured':   { tr: 'Öne Çıkan Ürünler', en: 'Featured Products', de: 'Ausgewählte Produkte', fr: 'Produits Vedettes', es: 'Productos Destacados', ru: 'Рекомендуемые товары', ar: 'المنتجات المميزة' },
    'default-satisfaction':{ tr: '%100 MEMNUNİYET GARANTİSİ', en: '100% SATISFACTION GUARANTEE', de: '100% ZUFRIEDENHEITSGARANTIE', fr: 'GARANTIE 100% SATISFACTION', es: 'GARANTÍA 100% SATISFACCIÓN', ru: '100% ГАРАНТИЯ КАЧЕСТВА', ar: 'ضمان الرضا 100%' },
    'default-news':        { tr: 'HABERLER & İPUÇLARI', en: 'NEWS & TIPS', de: 'NEUIGKEITEN & TIPPS', fr: 'ACTUALITÉS & CONSEILS', es: 'NOTICIAS Y CONSEJOS', ru: 'НОВОСТИ И СОВЕТЫ', ar: 'أخبار ونصائح' },
    'default-testimonials':{ tr: 'MÜŞTERİLERİMİZ NE SÖYLÜYOR', en: 'WHAT OUR CUSTOMERS SAY', de: 'WAS UNSERE KUNDEN SAGEN', fr: 'CE QUE DISENT NOS CLIENTS', es: 'LO QUE DICEN NUESTROS CLIENTES', ru: 'ЧТО ГОВОРЯТ НАШИ КЛИЕНТЫ', ar: 'ما يقوله عملاؤنا' },
};

function getMockSections(): HomepageSectionDto[] {
    const lang = i18next.language?.split('-')[0] ?? 'en';
    return defaultHomepageSections.map(section => ({
        ...section,
        title: SECTION_TITLE_TRANSLATIONS[section.id]?.[lang]
            ?? SECTION_TITLE_TRANSLATIONS[section.id]?.['en']
            ?? section.title,
    }));
}

/** Language-aware slide content for mock mode */
const MOCK_SLIDES_BY_LANG: Record<string, { title: string; subtitle: string; description: string; buttonText: string }[]> = {
    tr: [
        { title: 'Hoş Geldiniz', subtitle: 'Mağazamıza hoş geldiniz', description: 'En kaliteli ürünleri uygun fiyatlarla sunuyoruz.', buttonText: 'Alışverişe Başla' },
        { title: 'Özel Kampanyalar', subtitle: 'Seçili ürünlerde fırsatlar', description: 'Kaçırmayın, sınırlı süre geçerlidir.', buttonText: 'Fırsatları Keşfet' },
    ],
    en: [
        { title: 'Welcome', subtitle: 'Welcome to our store', description: 'We offer the finest products at great prices.', buttonText: 'Start Shopping' },
        { title: 'Special Offers', subtitle: 'Deals on selected products', description: 'Don\'t miss out — limited time only.', buttonText: 'Explore Deals' },
    ],
    de: [
        { title: 'Willkommen', subtitle: 'Willkommen in unserem Shop', description: 'Wir bieten die besten Produkte zu fairen Preisen.', buttonText: 'Jetzt einkaufen' },
        { title: 'Sonderangebote', subtitle: 'Aktionen auf ausgewählte Produkte', description: 'Nicht verpassen — nur für begrenzte Zeit.', buttonText: 'Angebote entdecken' },
    ],
    fr: [
        { title: 'Bienvenue', subtitle: 'Bienvenue dans notre boutique', description: 'Nous proposons les meilleurs produits aux meilleurs prix.', buttonText: 'Commencer' },
        { title: 'Offres Spéciales', subtitle: 'Promotions sur des produits sélectionnés', description: 'Ne ratez pas — durée limitée.', buttonText: 'Découvrir les offres' },
    ],
    es: [
        { title: 'Bienvenido', subtitle: 'Bienvenido a nuestra tienda', description: 'Ofrecemos los mejores productos a precios increíbles.', buttonText: 'Empezar a comprar' },
        { title: 'Ofertas Especiales', subtitle: 'Descuentos en productos seleccionados', description: 'No te lo pierdas — tiempo limitado.', buttonText: 'Ver ofertas' },
    ],
    ru: [
        { title: 'Добро пожаловать', subtitle: 'Добро пожаловать в наш магазин', description: 'Мы предлагаем лучшие товары по отличным ценам.', buttonText: 'Начать покупки' },
        { title: 'Специальные предложения', subtitle: 'Скидки на выбранные товары', description: 'Не пропустите — ограниченное время.', buttonText: 'Посмотреть акции' },
    ],
    ar: [
        { title: 'مرحبًا بك', subtitle: 'مرحبًا بك في متجرنا', description: 'نقدم أفضل المنتجات بأسعار رائعة.', buttonText: 'ابدأ التسوق' },
        { title: 'عروض خاصة', subtitle: 'خصومات على منتجات مختارة', description: 'لا تفوت الفرصة — لفترة محدودة فقط.', buttonText: 'استكشف العروض' },
    ],
};

function getMockSlides() {
    const lang = i18next.language?.split('-')[0] ?? 'tr';
    const texts = MOCK_SLIDES_BY_LANG[lang] ?? MOCK_SLIDES_BY_LANG['tr'];
    return [
        {
            id: 'mock-slide-1',
            imageBase64: undefined,
            imageUrl: undefined,
            textColor: '#FFFFFF',
            overlayColor: '#2C3E50',
            overlayOpacity: 85,
            buttonLink: '/products',
            buttonVisible: true,
            ...texts[0],
        },
        {
            id: 'mock-slide-2',
            imageBase64: undefined,
            imageUrl: undefined,
            textColor: '#FFFFFF',
            overlayColor: '#1A252F',
            overlayOpacity: 80,
            buttonLink: '/products',
            buttonVisible: true,
            ...texts[1],
        },
    ];
}

// Mock simulates what the backend returns when VITE_USE_MOCK_API=true.
// Uses the same white-label neutral defaults as the backend query handler
// so developers see a realistic "fresh install" state during local dev.
const _mockSettings: StoreSettingsDto = {
    // Brand
    imageBase64: undefined,
    storeName: 'Demo Store',
    showStoreNameInHeader: true,
    // Area bg colors
    primaryColor: '#2C3E50',
    headerBackgroundColor: '#2C3E50',
    bannerBackgroundColor: '#243342',
    backgroundColor: '#F5F6F7',
    adminSidebarBackgroundColor: '#2C3E50',
    adminPageBackgroundColor: '#F4F6F8',
    // Banner
    freeShippingBannerText: 'FREE SHIPPING ON ORDERS OVER $100!',
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
        slides: [],
    },
    homepageSections: defaultHomepageSections,
    footer: defaultFooterSettings,
};

function buildMockSettings(): StoreSettingsDto {
    return {
        ..._mockSettings,
        heroCarousel: {
            ..._mockSettings.heroCarousel,
            slides: _mockSettings.heroCarousel.slides.length > 0
                ? _mockSettings.heroCarousel.slides
                : getMockSlides(),
        },
        homepageSections: _mockSettings.homepageSections === defaultHomepageSections
            ? getMockSections()
            : _mockSettings.homepageSections,
        footer: _mockSettings.footer === defaultFooterSettings
            ? getMockFooter()
            : _mockSettings.footer,
    };
}

/** Admin-only: GET /api/admin/store-settings */
export async function getAdminStoreSettings(): Promise<StoreSettingsDto> {
    if (USE_MOCK) return buildMockSettings();
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
    if (USE_MOCK) return buildMockSettings();
    const res = await apiClient.get<StoreSettingsDto>('/api/store/settings');
    return res.data;
}
