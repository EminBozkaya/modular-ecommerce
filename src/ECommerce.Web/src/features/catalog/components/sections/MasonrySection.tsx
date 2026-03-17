import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

const colClasses: Record<number, string> = {
    2: 'columns-1 md:columns-2',
    3: 'columns-1 md:columns-2 lg:columns-3',
    4: 'columns-1 sm:columns-2 lg:columns-4',
};

export function MasonrySection({ section }: { section: HomepageSectionDto }) {
    const cols = colClasses[section.columns] || colClasses[3];
    return (
        <div className={`${cols} gap-6`}>
            {section.cards.map((card) => (
                <div key={card.id} className="break-inside-avoid mb-6">
                    <SectionCard card={card} />
                </div>
            ))}
        </div>
    );
}
