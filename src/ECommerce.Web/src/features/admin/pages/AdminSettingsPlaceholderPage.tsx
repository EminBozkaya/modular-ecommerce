import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

/**
 * General-purpose placeholder — auto-derives page title from URL path.
 */

export default function AdminSettingsPlaceholderPage() {
    const { t } = useTranslation('admin');
    const { pathname } = useLocation();
    const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';

    const titleKeyMap: Record<string, string> = {
        payment: 'nav.payment',
        shipping: 'nav.shipping',
        logo: 'nav.logo',
        colors: 'nav.colors',
        hero: 'nav.hero',
        nav: 'nav.navOrder',
        banners: 'nav.banners',
    };

    const titleKey = titleKeyMap[lastSegment];
    const title = titleKey ? t(titleKey) : t('nav.settings');

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(27,94,63,0.08)' }}
            >
                <Settings className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>
                {title}
            </h1>
            <p className="text-sm max-w-md" style={{ color: '#6b7280' }}>
                {t('design.common.placeholderDesc', { title: title.toLowerCase() })}
            </p>
        </div>
    );
}
