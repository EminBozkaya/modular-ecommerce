import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { SectionCard } from './SectionCard';

const cornerRadii = [
    'rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-[4rem]', // top-left card: large inner bottom-right
    'rounded-tl-lg rounded-tr-lg rounded-bl-[4rem] rounded-br-lg', // top-right card: large inner bottom-left
    'rounded-tl-lg rounded-tr-[4rem] rounded-bl-lg rounded-br-lg', // bottom-left card: large inner top-right
    'rounded-tl-[4rem] rounded-tr-lg rounded-bl-lg rounded-br-lg', // bottom-right card: large inner top-left
];

export function CloverSection({ section }: { section: HomepageSectionDto }) {
    const cards = section.cards.slice(0, 4);
    if (cards.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {cards.map((card, i) => (
                <div key={card.id} className={`overflow-hidden ${cornerRadii[i] || ''}`}>
                    <SectionCard card={card} />
                </div>
            ))}
        </div>
    );
}
