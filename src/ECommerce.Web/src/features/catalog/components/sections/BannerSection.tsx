import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/features/admin/api/storeSettingsApi';
import type { HomepageSectionDto } from '@/features/admin/api/storeSettingsApi';

export function BannerSection({ section }: { section: HomepageSectionDto }) {
    const { i18n } = useTranslation();
    const lang = i18n.language.split('-')[0].toLowerCase();
    
    const card = section.cards[0];
    if (!card) return null;

    const title = getLocalizedText(card, 'title', lang);
    const description = getLocalizedText(card, 'description', lang);
    const buttonText = getLocalizedText(card, 'buttonText', lang);

    const imgSrc = card.imageBase64 || card.imageUrl;
    const href = card.linkType !== 'none' && card.linkTarget ? card.linkTarget : undefined;

    const content = (
        <div className="relative py-20">
            {imgSrc && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url('${imgSrc}')` }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: card.overlayColor,
                            opacity: card.overlayOpacity / 100,
                        }}
                    />
                </div>
            )}
            {!imgSrc && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: card.overlayColor,
                        opacity: card.overlayOpacity / 100,
                    }}
                />
            )}
            <div className="relative container mx-auto px-4 text-center">
                {title && (
                    <h2
                        className="text-3xl md:text-4xl font-serif font-bold mb-4"
                        style={{ color: card.textColor }}
                    >
                        {title}
                    </h2>
                )}
                {description && (
                    <p
                        className="max-w-2xl mx-auto mb-8 leading-relaxed opacity-90"
                        style={{ color: card.textColor }}
                    >
                        {description}
                    </p>
                )}
                {card.buttonVisible && buttonText && (
                    <span className="inline-block bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white px-8 py-3 text-sm font-semibold tracking-wider rounded-md transition-colors">
                        {buttonText}
                    </span>
                )}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link to={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
}
