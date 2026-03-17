import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';

interface Props {
    section: HomepageSectionDto;
    children: React.ReactNode;
}

export function SectionWrapper({ section, children }: Props) {
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
                        {section.title}
                    </h2>
                )}
                {children}
            </div>
        </section>
    );
}
