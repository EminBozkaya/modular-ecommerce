import { useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';

/**
 * Genel amaçlı placeholder — her settings route'u için
 * URL path'ten sayfa başlığını otomatik türetir.
 */

const titleMap: Record<string, string> = {
    payment: 'Ödeme Ayarları',
    shipping: 'Kargo Ayarları',
    logo: 'Marka & Logo',
    colors: 'Renk Paleti',
    hero: 'Hero Carousel',
    nav: 'Navigasyon',
    banners: 'Bannerlar',
};

export default function AdminSettingsPlaceholderPage() {
    const { pathname } = useLocation();
    const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
    const title = titleMap[lastSegment] ?? 'Ayarlar';

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
                Bu sayfa henüz yapım aşamasındadır. Yakında buradan{' '}
                <strong>{title.toLowerCase()}</strong> yönetimi yapabileceksiniz.
            </p>
        </div>
    );
}
