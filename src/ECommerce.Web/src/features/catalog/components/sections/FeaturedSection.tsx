import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

export function FeaturedSection({ section }: { section: HomepageSectionDto }) {
    const [hero, ...rest] = section.cards;
    if (!hero) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SectionCard
                card={hero}
                className="md:row-span-2 min-h-[500px]"
            />
            {rest.map((card) => (
                <SectionCard key={card.id} card={card} />
            ))}
        </div>
    );
}
