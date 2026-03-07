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
        title: "50 Yılı Aşkın Aile Geleneği",
        subtitle: "Yeni Şubemiz Açıldı!",
        description: "Ebrar Kuruyemiş olarak 50 yılı aşkın tecrübemizle en taze ve kaliteli ürünleri güvenle sunuyoruz.",
        buttonText: "KEŞFET",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=1920&h=800&fit=crop",
    },
    {
        title: "Premium Kalite Kuruyemiş",
        subtitle: "Çiftlikten Sofranıza",
        description: "Dünyanın dört bir yanından titizlikle seçilmiş en kaliteli kuruyemişleri sizlere sunuyoruz.",
        buttonText: "ALIŞVERİŞE BAŞLA",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1920&h=800&fit=crop",
    },
    {
        title: "Özel Hediye Koleksiyonu",
        subtitle: "Hediye Kutuları Hazır",
        description: "Sevdikleriniz için özenle hazırlanmış premium kuruyemiş ve kuru meyve hediye kutularını keşfedin.",
        buttonText: "HEDİYELERİ GÖR",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1574570173583-a65fc27484be?w=1920&h=800&fit=crop",
    },
];

export const mainCategories: FeaturedCategory[] = [
    {
        name: "KURU MEYVE",
        image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400&h=300&fit=crop",
        link: "/products?categoryId=4",
    },
    {
        name: "KURUYEMİŞ",
        image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=300&fit=crop",
        link: "/products?categoryId=1",
    },
    {
        name: "ATIŞTIYRMALIK & MİX",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
        link: "/products?categoryId=5",
    },
];

export const featuredProducts: FeaturedProduct[] = [
    {
        title: "HAFTANIN FIRSATI",
        subtitle: "Türk Kayısısı & Çekirdekli Hurma",
        badge: "İndirimli",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=400&h=500&fit=crop",
        large: true,
    },
    {
        title: "ÜYELİK KULÜBÜ",
        subtitle: "Her ay kapınıza özel seçilmiş kuruyemiş paketi.",
        buttonText: "KATIL",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1574570173583-a65fc27484be?w=400&h=300&fit=crop",
    },
    {
        title: "TOHUMLAR",
        subtitle: "Çeşit Çeşit Tohumlar",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=200&fit=crop",
    },
    {
        title: "HEDİYELER",
        subtitle: "Hediye için ihtiyacınız olan her şey!",
        buttonText: "ALIŞVERİŞ YAP",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1513135065346-a098a63a71ee?w=400&h=200&fit=crop",
    },
];

export const newsItems: NewsItem[] = [
    {
        title: "ŞİMDİ İNDİRİMDE!",
        description: "Kuru Kayısı & Çekirdekli Hurma'da özel indirim – Sınırlı süre! Premium kalite ürünlerimizi kaçırmayın...",
        image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=200&h=200&fit=crop",
    },
    {
        title: "YENİ ŞUBE",
        description: "Yeni şubemizi ziyaret edin! Daha geniş ürün yelpazesi ve kolay erişim ile hizmetinizdeyiz...",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
    },
];

export const testimonials: Testimonial[] = [
    {
        quote: "Harika ürünler. Zamanında teslim edildi. Hediye kutusunu çok beğendik! Teşekkürler!",
        author: "Ayşe Y.",
        location: "İstanbul",
    },
    {
        quote: "İlk kez sipariş verdim ve artık sürekli müşteriyim! Mango dilimleri muhteşem.",
        author: "Mehmet K.",
        location: "Ankara",
    },
    {
        quote: "Yıl boyunca kabuklu kuruyemiş bulabilmek harika. Kuruyemişlerinizi çok seviyorum, TEŞEKKÜRLER!",
        author: "Fatma C.",
        location: "İzmir",
    },
];
