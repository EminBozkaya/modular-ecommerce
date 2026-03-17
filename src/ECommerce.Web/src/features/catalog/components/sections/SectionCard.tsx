import { Link } from 'react-router-dom';
import type { SectionCardDto } from '@/features/admin/api/storeSettingsApi';

interface Props {
    card: SectionCardDto;
    className?: string;
}

const aspectClasses: Record<string, string> = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    auto: '',
};

const textPositionClasses: Record<string, string> = {
    'top-left': 'items-start justify-start text-left',
    'top-right': 'items-start justify-end text-right',
    'bottom-left': 'items-end justify-start text-left',
    'bottom-right': 'items-end justify-end text-right',
    center: 'items-center justify-center text-center',
};

function CardContent({ card }: { card: SectionCardDto }) {
    const imgSrc = card.imageBase64 || card.imageUrl;
    const hasBackground = Boolean(imgSrc) || card.overlayOpacity > 0;
    const isTextOnly = !hasBackground && card.aspectRatio === 'auto';
    const aspect = aspectClasses[card.aspectRatio] || '';
    const textPos = textPositionClasses[card.textPosition] || textPositionClasses.center;

    // Text-only card (no image, no overlay, auto aspect) — use normal flow layout
    if (isTextOnly) {
        return (
            <div className="rounded-lg border border-border bg-card p-6 h-full min-h-[160px] flex flex-col justify-center text-center">
                {card.title && (
                    <h3 className="font-serif font-bold text-lg mb-1" style={{ color: card.textColor !== '#FFFFFF' ? card.textColor : '#1a1a1a' }}>
                        {card.title}
                    </h3>
                )}
                {card.subtitle && (
                    <p className="text-sm text-muted-foreground mb-1">{card.subtitle}</p>
                )}
                {card.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{card.description}</p>
                )}
                {card.buttonVisible && card.buttonText && (
                    <span className="mt-3 inline-block self-center bg-[var(--brand-primary)] text-white text-xs px-4 py-2 rounded-md">
                        {card.buttonText}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-lg group ${aspect || 'min-h-[200px]'}`}>
            {/* Background image */}
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            )}

            {/* Overlay */}
            {card.overlayOpacity > 0 && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: card.overlayColor,
                        opacity: card.overlayOpacity / 100,
                    }}
                />
            )}

            {/* Badge */}
            {card.badgeText && (
                <div
                    className={`absolute z-10 ${card.badgePosition === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'}`}
                >
                    <span
                        className="text-white text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: card.badgeColor || 'var(--brand-primary)' }}
                    >
                        {card.badgeText}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col p-6 ${textPos}`}>
                <div className="max-w-md">
                    {card.title && (
                        <h3
                            className="text-xl font-serif font-bold mb-1"
                            style={{ color: card.textColor }}
                        >
                            {card.title}
                        </h3>
                    )}
                    {card.subtitle && (
                        <p className="text-sm mb-2 opacity-90" style={{ color: card.textColor }}>
                            {card.subtitle}
                        </p>
                    )}
                    {card.description && (
                        <p
                            className="text-sm mb-4 leading-relaxed opacity-90 max-w-lg"
                            style={{ color: card.textColor }}
                        >
                            {card.description}
                        </p>
                    )}
                    {card.buttonVisible && card.buttonText && (
                        <span className="inline-block bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs tracking-wider px-4 py-2 rounded-md transition-colors">
                            {card.buttonText}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function SectionCard({ card, className = '' }: Props) {
    const resolveLink = (): string | undefined => {
        if (card.linkType === 'none' || !card.linkTarget) return undefined;
        if (card.linkType === 'product') return `/products/${card.linkTarget}`;
        if (card.linkType === 'category') return `/products?categoryId=${card.linkTarget}`;
        return card.linkTarget; // url type
    };

    const href = resolveLink();

    if (href) {
        const isExternal = href.startsWith('http');
        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block cursor-pointer ${className}`}
                >
                    <CardContent card={card} />
                </a>
            );
        }
        return (
            <Link to={href} className={`block cursor-pointer ${className}`}>
                <CardContent card={card} />
            </Link>
        );
    }

    return (
        <div className={className}>
            <CardContent card={card} />
        </div>
    );
}
