import { useStoreSettings } from '@/context/StoreSettingsContext';
import type { HomepageSectionDto, SectionLayout } from '@/features/admin/api/storeSettingsApi';
import { SectionWrapper } from './sections/SectionWrapper';
import { GridSection } from './sections/GridSection';
import { FeaturedSection } from './sections/FeaturedSection';
import { BannerSection } from './sections/BannerSection';
import { CarouselSection } from './sections/CarouselSection';
import { MasonrySection } from './sections/MasonrySection';
import { CloverSection } from './sections/CloverSection';
import { CollageSection } from './sections/CollageSection';

type LayoutRenderer = React.ComponentType<{ section: HomepageSectionDto }>;

const LAYOUT_MAP: Record<SectionLayout, LayoutRenderer> = {
    grid: GridSection,
    featured: FeaturedSection,
    banner: BannerSection,
    carousel: CarouselSection,
    masonry: MasonrySection,
    clover: CloverSection,
    collage: CollageSection,
};

interface Props {
    sections?: HomepageSectionDto[];
}

export function HomepageSections({ sections: overrideSections }: Props) {
    const settings = useStoreSettings();
    const sections = overrideSections ?? settings.homepageSections ?? [];

    const sorted = [...sections]
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order);

    if (sorted.length === 0) return null;

    return (
        <>
            {sorted.map((section) => {
                const Renderer = LAYOUT_MAP[section.layout] || GridSection;
                const isBanner = section.layout === 'banner';

                if (isBanner) {
                    return <Renderer key={section.id} section={section} />;
                }

                return (
                    <SectionWrapper key={section.id} section={section}>
                        <Renderer section={section} />
                    </SectionWrapper>
                );
            })}
        </>
    );
}
