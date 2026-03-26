import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/features/admin/api/storeSettingsApi';

interface Props {
    section: HomepageSectionDto;
    children: React.ReactNode;
}

export function SectionWrapper({ section, children }: Props) {
    const { i18n } = useTranslation();
    const lang = i18n.language.split('-')[0].toLowerCase();

    return (
        <section
            style={{
                backgroundColor: section.backgroundColor === 'transparent' ? undefined : section.backgroundColor,
                paddingTop: `${section.paddingY}px`,
                paddingBottom: `${section.paddingY}px`,
            }}
        >
            <div className="container mx-auto px-4">
                {section.showTitle && section.title && (
                    <h2 className="text-2xl font-serif font-bold text-center mb-8 text-foreground">
                        {getLocalizedText(section, 'title', lang)}
                    </h2>
                )}
                {children}
            </div>
        </section>
    );
}
