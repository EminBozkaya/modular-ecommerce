import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

export function CarouselSection({ section }: { section: HomepageSectionDto }) {
    if (section.cards.length === 0) return null;

    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: Math.min(section.columns, section.cards.length) },
            }}
        >
            {section.cards.map((card) => (
                <SwiperSlide key={card.id}>
                    <SectionCard card={card} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
