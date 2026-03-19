export interface HeroSlide {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

export interface FeaturedCategory {
    name: string;
    image: string;
    link: string;
}

export interface FeaturedProduct {
    title: string;
    subtitle: string;
    badge?: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    large?: boolean;
}

export interface NewsItem {
    title: string;
    description: string;
    image: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    location: string;
}

export const heroSlides: HeroSlide[] = [
    {
        title: "Mağazamıza Hoş Geldiniz",
        subtitle: "Kaliteli Ürünler, Hızlı Teslimat",
        description: "Geniş ürün yelpazemiz ve güvenilir hizmetimizle alışverişin keyfini çıkarın.",
        buttonText: "KEŞFET",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/hero-1/1920/800",
    },
    {
        title: "Özel Fırsatlar",
        subtitle: "En İyi Fiyat Garantisi",
        description: "Seçili ürünlerde kaçırılmayacak indirimler sizi bekliyor.",
        buttonText: "ALIŞVERİŞE BAŞLA",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/hero-2/1920/800",
    },
    {
        title: "Yeni Koleksiyon",
        subtitle: "Sezon Ürünleri",
        description: "En yeni ürünlerimizi keşfedin ve koleksiyonunuzu tamamlayın.",
        buttonText: "YENİLERİ GÖR",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/hero-3/1920/800",
    },
];

export const mainCategories: FeaturedCategory[] = [
    {
        name: "KATEGORİ-A",
        image: "https://picsum.photos/seed/cat-a/400/300",
        link: "/products?categoryId=1",
    },
    {
        name: "KATEGORİ-B",
        image: "https://picsum.photos/seed/cat-b/400/300",
        link: "/products?categoryId=2",
    },
    {
        name: "KATEGORİ-C",
        image: "https://picsum.photos/seed/cat-c/400/300",
        link: "/products?categoryId=3",
    },
];

export const featuredProducts: FeaturedProduct[] = [
    {
        title: "HAFTANIN FIRSATI",
        subtitle: "Seçili ürünlerde özel indirim fırsatı.",
        badge: "İndirimli",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/featured-1/400/500",
        large: true,
    },
    {
        title: "YENİ GELENLER",
        subtitle: "En son eklenen ürünleri keşfedin.",
        buttonText: "İNCELE",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/featured-2/400/300",
    },
    {
        title: "ÇOK SATANLAR",
        subtitle: "En popüler ürünlerimiz.",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/featured-3/400/200",
    },
    {
        title: "HEDİYELER",
        subtitle: "Sevdikleriniz için hediye fikirleri!",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://picsum.photos/seed/featured-4/400/200",
    },
];

export const newsItems: NewsItem[] = [
    {
        title: "İNDİRİM KAMPANYASI",
        description: "Seçili ürünlerde sınırlı süreli özel indirimler devam ediyor. Fırsatları kaçırmayın!",
        image: "https://picsum.photos/seed/news-1/200/200",
    },
    {
        title: "YENİ KOLEKSİYON",
        description: "Bu sezonun en yeni ürünleri mağazamızda. Geniş ürün yelpazesiyle hizmetinizdeyiz.",
        image: "https://picsum.photos/seed/news-2/200/200",
    },
];

export const testimonials: Testimonial[] = [
    {
        quote: "Harika ürünler ve hızlı teslimat. Çok memnun kaldım, teşekkürler!",
        author: "Alex M.",
        location: "Berlin",
    },
    {
        quote: "Ürün kalitesi beklentimin çok üzerindeydi. Kesinlikle tekrar sipariş vereceğim.",
        author: "Sarah L.",
        location: "London",
    },
    {
        quote: "Müşteri hizmetleri çok ilgili. Ürünler tam zamanında ve sorunsuz ulaştı.",
        author: "Yuki T.",
        location: "Tokyo",
    },
];
