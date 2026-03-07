import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    heroSlides,
    mainCategories,
    featuredProducts,
    newsItems,
    testimonials,
} from '../api/homepageMock';

export default function StorefrontHomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            {/* ========== HERO CAROUSEL ========== */}
            <section className="relative h-[500px] overflow-hidden" id="hero-carousel">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{
                        backgroundImage: `url('${heroSlides[currentSlide].image}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-lg text-white">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-tight">
                            {heroSlides[currentSlide].title}
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-serif mb-4 text-white/90">
                            {heroSlides[currentSlide].subtitle}
                        </h3>
                        <p className="text-white/85 mb-6 leading-relaxed">
                            {heroSlides[currentSlide].description}
                        </p>
                        <Link
                            to={heroSlides[currentSlide].buttonLink}
                            className="inline-block bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white px-8 py-3 text-sm font-semibold tracking-wider rounded-md transition-colors"
                        >
                            {heroSlides[currentSlide].buttonText}
                        </Link>
                    </div>
                </div>

                {/* Carousel Controls */}
                <button
                    onClick={() =>
                        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 p-3 rounded-full transition-colors"
                    aria-label="Önceki slayt"
                >
                    <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                    onClick={() =>
                        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 p-3 rounded-full transition-colors"
                    aria-label="Sonraki slayt"
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'
                                }`}
                            aria-label={`Slayt ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ========== MAIN CATEGORIES ========== */}
            <section className="py-12 bg-background" id="main-categories">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.name}
                                to={category.link}
                                className="relative group overflow-hidden rounded-lg cursor-pointer block"
                            >
                                <div className="aspect-[4/3] relative">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="inline-block bg-[var(--color-ebrar-green)] text-white px-4 py-2 text-sm font-semibold tracking-wider rounded">
                                            {category.name}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FEATURED PRODUCTS GRID ========== */}
            <section className="py-8 bg-background" id="featured-products">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* This Week's Special - Large Card */}
                        <div className="relative group overflow-hidden rounded-lg cursor-pointer md:row-span-2">
                            <Link to={featuredProducts[0].buttonLink} className="block h-full min-h-[500px] relative">
                                <img
                                    src={featuredProducts[0].image}
                                    alt={featuredProducts[0].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {featuredProducts[0].badge && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[var(--color-ebrar-gold)] text-white text-xs px-3 py-1 rounded-full font-medium">
                                            {featuredProducts[0].badge}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-serif font-bold text-white mb-1">
                                        {featuredProducts[0].title}
                                    </h3>
                                    <p className="text-[var(--color-ebrar-gold)] text-sm mb-3">
                                        {featuredProducts[0].subtitle}
                                    </p>
                                    <span className="inline-block bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white text-xs tracking-wider px-4 py-2 rounded-md transition-colors">
                                        {featuredProducts[0].buttonText}
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Harvest Club */}
                        <Link
                            to={featuredProducts[1].buttonLink}
                            className="relative group overflow-hidden rounded-lg cursor-pointer block"
                        >
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={featuredProducts[1].image}
                                    alt={featuredProducts[1].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                    <h3 className="text-xl font-serif font-bold text-white mb-2">
                                        {featuredProducts[1].title}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-4 max-w-[200px]">
                                        {featuredProducts[1].subtitle}
                                    </p>
                                    <span className="inline-block bg-[var(--color-ebrar-gold)] hover:bg-[var(--color-ebrar-gold-dark)] text-white text-xs tracking-wider px-4 py-2 rounded-md transition-colors">
                                        {featuredProducts[1].buttonText}
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Seeds */}
                        <Link
                            to={featuredProducts[2].buttonLink}
                            className="relative group overflow-hidden rounded-lg cursor-pointer block"
                        >
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={featuredProducts[2].image}
                                    alt={featuredProducts[2].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <h3 className="text-xl font-serif font-bold text-white">
                                        {featuredProducts[2].title}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {featuredProducts[2].subtitle}
                                    </p>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-block bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white text-xs tracking-wider px-4 py-2 rounded-md transition-colors">
                                        {featuredProducts[2].buttonText}
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Gifts */}
                        <Link
                            to={featuredProducts[3].buttonLink}
                            className="relative group overflow-hidden rounded-lg cursor-pointer block"
                        >
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={featuredProducts[3].image}
                                    alt={featuredProducts[3].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <h3 className="text-xl font-serif font-bold text-white">
                                        {featuredProducts[3].title}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {featuredProducts[3].subtitle}
                                    </p>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-block bg-[var(--color-ebrar-gold)] hover:bg-[var(--color-ebrar-gold-dark)] text-white text-xs tracking-wider px-4 py-2 rounded-md transition-colors">
                                        {featuredProducts[3].buttonText}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== 100% SATISFACTION GUARANTEED ========== */}
            <section className="relative py-20" id="satisfaction-banner">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1920&h=600&fit=crop')",
                    }}
                >
                    <div className="absolute inset-0 bg-[var(--color-ebrar-green)]/85" />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        %100 MEMNUNİYET GARANTİSİ
                    </h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Müşterilerimize Badem, Ceviz, Fıstık ve Fındık dahil en taze toptan kuruyemişleri sunuyoruz.
                        Kabuklu ya da kabuksuz, en kaliteli ürünler burada.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-[var(--color-ebrar-gold)] hover:bg-[var(--color-ebrar-gold-dark)] text-white px-8 py-3 text-sm font-semibold tracking-wider rounded-md transition-colors"
                    >
                        DAHA FAZLA BİLGİ
                    </Link>
                </div>
            </section>

            {/* ========== NEWS & TIPS ========== */}
            <section className="py-16 bg-background" id="news-tips">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-serif font-bold text-center mb-8 text-foreground">
                        HABERLER & İPUÇLARI
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
                        {newsItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 max-w-md">
                                <div className="w-32 h-32 relative flex-shrink-0 rounded-lg overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                    <button className="inline-flex items-center justify-center text-xs font-medium border border-border rounded-md px-3 py-1.5 hover:bg-accent transition-colors">
                                        DEVAMINI OKU
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <button className="inline-flex items-center justify-center bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white px-6 py-2 text-sm tracking-wider rounded-md transition-colors">
                            TÜMÜNÜ OKU
                        </button>
                    </div>
                </div>
            </section>

            {/* ========== TESTIMONIALS ========== */}
            <section className="py-16 bg-muted/30" id="testimonials">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-serif font-bold text-center mb-12 text-foreground">
                        MÜŞTERİLERİMİZ NE DİYOR?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="text-center">
                                <div className="text-5xl text-[var(--color-ebrar-green)] mb-4">&ldquo;</div>
                                <p className="text-muted-foreground mb-4 leading-relaxed italic">
                                    {testimonial.quote}
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                    -{testimonial.author} / {testimonial.location}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button className="inline-flex items-center justify-center bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white px-6 py-2 text-sm tracking-wider rounded-md transition-colors">
                            DAHA FAZLA
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
