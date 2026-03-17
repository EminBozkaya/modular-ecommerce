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
import type { HeroCarouselDto, HeroSlideDto } from '../../../features/admin/api/storeSettingsApi';

function hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity / 100})`;
}

function SlideContent({ slide, height }: { slide: HeroSlideDto; height: number }) {
    const hasImage = slide.imageBase64 ?? slide.imageUrl;

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            {/* Background */}
            {slide.imageBase64 ? (
                <img
                    src={slide.imageBase64}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : slide.imageUrl ? (
                <img
                    src={slide.imageUrl}
                    alt={slide.title}
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
                        {slide.title && (
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-tight">
                                {slide.title}
                            </h2>
                        )}
                        {slide.subtitle && (
                            <h3
                                className="text-2xl md:text-3xl font-serif mb-4"
                                style={{ color: slide.textColor, opacity: 0.9 }}
                            >
                                {slide.subtitle}
                            </h3>
                        )}
                        {slide.description && (
                            <p className="mb-6 leading-relaxed" style={{ opacity: 0.85 }}>
                                {slide.description}
                            </p>
                        )}
                        {slide.buttonVisible && slide.buttonText && (
                            <Link
                                to={slide.buttonLink || '/products'}
                                className="inline-block px-8 py-3 text-sm font-semibold tracking-wider rounded-md transition-colors text-white"
                                style={{ backgroundColor: 'var(--brand-primary)' }}
                            >
                                {slide.buttonText}
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
            className="relative overflow-hidden"
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
                navigation={carousel.showArrows}
                pagination={carousel.showDots ? { clickable: true } : false}
                className="h-full w-full"
                style={{ height: carousel.height }}
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
        </section>
    );
}
