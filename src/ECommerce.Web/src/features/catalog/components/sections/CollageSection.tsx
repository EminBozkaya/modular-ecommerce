import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

export function CollageSection({ section }: { section: HomepageSectionDto }) {
    if (section.cards.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {section.cards.map((card) => (
                <SectionCard
                    key={card.id}
                    card={card}
                    className={`${card.colSpan > 1 ? `md:col-span-${card.colSpan}` : ''} ${card.rowSpan > 1 ? `row-span-${card.rowSpan}` : ''}`}
                />
            ))}
        </div>
    );
}
