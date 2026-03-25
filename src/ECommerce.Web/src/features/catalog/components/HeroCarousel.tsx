import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow, EffectFlip } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/features/admin/api/storeSettingsApi';
import type { HeroCarouselDto, HeroSlideDto } from '@/features/admin/api/storeSettingsApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity / 100})`;
}

function SlideContent({ slide, height }: { slide: HeroSlideDto; height: number }) {
    const { i18n } = useTranslation();
    const lang = i18n.language.split('-')[0].toLowerCase();
    
    const title = getLocalizedText(slide, 'title', lang);
    const subtitle = getLocalizedText(slide, 'subtitle', lang);
    const description = getLocalizedText(slide, 'description', lang);
    const buttonText = getLocalizedText(slide, 'buttonText', lang);

    const hasImage = slide.imageBase64 ?? slide.imageUrl;

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            {/* Background */}
            {slide.imageBase64 ? (
                <img
                    src={slide.imageBase64}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : slide.imageUrl ? (
                <img
                    src={slide.imageUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: slide.overlayColor }}
                />
            )}

            {/* Overlay — always shown on top of image, skip for no-image slides (bg already set) */}
            {hasImage && (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: hexToRgba(slide.overlayColor, slide.overlayOpacity) }}
                />
            )}

            {/* Content */}
            <div
                className="relative h-full flex items-center"
                style={{ color: slide.textColor }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-lg">
                        {title && (
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-tight">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <h3
                                className="text-2xl md:text-3xl font-serif mb-4"
                                style={{ color: slide.textColor, opacity: 0.9 }}
                            >
                                {subtitle}
                            </h3>
                        )}
                        {description && (
                            <p className="mb-6 leading-relaxed" style={{ opacity: 0.85 }}>
                                {description}
                            </p>
                        )}
                        {slide.buttonVisible && buttonText && (
                            <Link
                                to={slide.buttonLink || '/products'}
                                className="inline-block px-8 py-3 text-sm font-semibold tracking-wider rounded-md transition-colors text-white"
                                style={{ backgroundColor: 'var(--brand-primary)' }}
                            >
                                {buttonText}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HeroCarousel() {
    const settings = useStoreSettings();
    const carousel: HeroCarouselDto = settings.heroCarousel;
    const swiperRef = useRef<SwiperRef>(null);

    if (!carousel.enabled || carousel.slides.length === 0) return null;

    const modules = [Navigation, Pagination, Autoplay];
    if (carousel.effect === 'fade') modules.push(EffectFade);
    if (carousel.effect === 'coverflow') modules.push(EffectCoverflow);
    if (carousel.effect === 'flip') modules.push(EffectFlip);

    return (
        <section
            id="hero-carousel"
            className="relative overflow-hidden group"
            style={{ height: carousel.height }}
        >
            <Swiper
                ref={swiperRef}
                modules={modules}
                effect={carousel.effect}
                loop={carousel.loop}
                autoplay={
                    carousel.autoPlay
                        ? { delay: carousel.autoPlayInterval, disableOnInteraction: false }
                        : false
                }
                navigation={{
                    prevEl: '.hero-prev',
                    nextEl: '.hero-next',
                }}
                pagination={carousel.showDots ? { clickable: true } : false}
                className="h-full w-full"
                style={{ height: carousel.height } as React.CSSProperties}
                coverflowEffect={
                    carousel.effect === 'coverflow'
                        ? { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }
                        : undefined
                }
            >
                {carousel.slides.map((slide) => (
                    <SwiperSlide key={slide.id} style={{ height: carousel.height }}>
                        <SlideContent slide={slide} height={carousel.height} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Modern Navigation Buttons */}
            {carousel.showArrows && (
                <>
                    <button
                        type="button"
                        className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 cursor-pointer active:scale-90"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    </button>
                    <button
                        type="button"
                        className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 cursor-pointer active:scale-90"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    </button>
                </>
            )}
        </section>
    );
}
