import { Link } from 'react-router-dom';
import {
    Instagram, Facebook, Twitter, Youtube, Linkedin,
    Phone, MapPin, Mail, Clock,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { useThemeStore } from '@/store/themeStore';
import type {
    FooterSettingsDto,
    FooterColumnDto,
    SocialPlatform,
} from '@/features/admin/api/storeSettingsApi';
import logoImg from '@/assets/LOGO.png';

interface FooterProps {
    /** When provided, renders this instead of settings.footer — used by admin preview */
    override?: FooterSettingsDto;
}

const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    tiktok: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z"/>
        </svg>
    ),
    whatsapp: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
    ),
};

function FooterColumn({ col, textColor, storeName, resolvedLogo }: {
    col: FooterColumnDto;
    textColor: string;
    storeName: string;
    resolvedLogo: string;
}) {
    const tc = textColor;
    const tcMuted = `${tc}B3`; // 70% opacity approximation via hex — falls back gracefully

    return (
        <div>
            {col.title && (
                <h3 className="font-semibold mb-4" style={{ color: tc }}>
                    {col.title}
                </h3>
            )}

            {col.type === 'links' && col.links && col.links.length > 0 && (
                <ul className="space-y-2 text-sm">
                    {[...col.links]
                        .sort((a, b) => a.order - b.order)
                        .map((link) => (
                            <li key={link.id}>
                                {link.url.startsWith('/') ? (
                                    <Link
                                        to={link.url}
                                        className="transition-colors hover:opacity-100"
                                        style={{ color: tcMuted }}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a
                                        href={link.url}
                                        className="transition-colors hover:opacity-100"
                                        style={{ color: tcMuted }}
                                    >
                                        {link.label}
                                    </a>
                                )}
                            </li>
                        ))}
                </ul>
            )}

            {col.type === 'contact' && (
                <ul className="space-y-3 text-sm">
                    {col.phone && (
                        <li className="flex items-center gap-2 justify-center lg:justify-start" style={{ color: tcMuted }}>
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{col.phone}</span>
                        </li>
                    )}
                    {col.email && (
                        <li className="flex items-center gap-2 justify-center lg:justify-start" style={{ color: tcMuted }}>
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <a href={`mailto:${col.email}`} className="hover:opacity-100 transition-opacity">{col.email}</a>
                        </li>
                    )}
                    {col.address && (
                        <li className="flex items-start gap-2 justify-center lg:justify-start" style={{ color: tcMuted }}>
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="whitespace-pre-line">{col.address}</span>
                        </li>
                    )}
                </ul>
            )}

            {col.type === 'social' && (
                <div>
                    {col.followText && (
                        <p className="text-sm mb-3" style={{ color: tcMuted }}>{col.followText}</p>
                    )}
                    <div className="flex items-center gap-3 justify-center lg:justify-start flex-wrap">
                        {col.socialLinks?.map((sl) => {
                            const Icon = SOCIAL_ICONS[sl.platform] ?? Instagram;
                            return (
                                <a
                                    key={sl.id}
                                    href={sl.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-opacity hover:opacity-100"
                                    style={{ color: tcMuted }}
                                    aria-label={sl.platform}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {col.type === 'about' && (
                <div className="space-y-3">
                    {col.showLogo && (
                        <img
                            src={resolvedLogo}
                            alt={storeName}
                            className="h-12 w-auto object-contain"
                        />
                    )}
                    {col.description && (
                        <p className="text-sm leading-relaxed" style={{ color: tcMuted }}>
                            {col.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export function Footer({ override }: FooterProps) {
    const settings = useStoreSettings();
    const { resolved: theme } = useThemeStore();
    const isDark = theme === 'dark';
    const footer = override ?? settings.footer;

    const bgColor = isDark
        ? 'var(--brand-tinted-dark-bg)'
        : (footer.backgroundColor ?? settings.primaryColor);
    const textColor = footer.textColor ?? '#FFFFFF';

    const enabledCols = [...footer.columns]
        .filter((c) => c.enabled)
        .sort((a, b) => a.order - b.order);

    const colCount = Math.min(Math.max(enabledCols.length, 1), 4);
    const gridClass: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    const resolvedLogo = settings.imageBase64 ?? logoImg;
    const year = new Date().getFullYear();

    const sortedBottomLinks = [...footer.bottomLinks].sort((a, b) => a.order - b.order);

    const bottomAlignClass = {
        left: 'justify-start',
        center: 'justify-center',
        between: 'justify-between',
    }[footer.bottomBarAlignment] ?? 'justify-between';

    return (
        <footer className="relative z-10 text-white" style={{ backgroundColor: bgColor }}>
            <div className="container mx-auto px-4 py-12">
                <div
                    className={`grid ${gridClass[colCount] ?? gridClass[4]} gap-12 max-w-5xl mx-auto text-center lg:text-left`}
                >
                    {enabledCols.map((col) => (
                        <FooterColumn
                            key={col.id}
                            col={col}
                            textColor={textColor}
                            storeName={settings.storeName}
                            resolvedLogo={resolvedLogo}
                        />
                    ))}
                </div>
            </div>

            <div className="border-t" style={{ borderColor: `${textColor}33` }}>
                <div className="container mx-auto px-4 py-4">
                    <div
                        className={`flex flex-col md:flex-row items-center gap-4 text-sm ${bottomAlignClass}`}
                        style={{ color: `${textColor}B3` }}
                    >
                        <p>
                            &copy; {year} {settings.storeName}. {footer.copyrightText}
                        </p>
                        {sortedBottomLinks.length > 0 && (
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                {sortedBottomLinks.map((link, idx) => (
                                    <span key={link.id} className="flex items-center gap-4">
                                        {idx > 0 && <span>|</span>}
                                        <a
                                            href={link.url}
                                            className="hover:opacity-100 transition-opacity"
                                        >
                                            {link.label}
                                        </a>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
