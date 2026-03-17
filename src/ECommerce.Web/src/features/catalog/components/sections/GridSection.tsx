import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

const colClasses: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
};

export function GridSection({ section }: { section: HomepageSectionDto }) {
    const cols = colClasses[section.columns] || colClasses[3];
    return (
        <div className={`grid ${cols} gap-6`}>
            {section.cards.map((card) => (
                <SectionCard key={card.id} card={card} />
            ))}
        </div>
    );
}
