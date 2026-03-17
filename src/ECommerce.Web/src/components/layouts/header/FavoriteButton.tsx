import { Link } from 'react-router-dom';
import { useWishlistProductIds } from '@/features/favorites/hooks/useFavorites';
import { useTranslation } from 'react-i18next';

export function FavoriteButton() {
    const { data: wishlistIds } = useWishlistProductIds();
    const favoriteCount = wishlistIds?.length ?? 0;
    const { t } = useTranslation('common');

    return (
        <div className="flex flex-col items-center group">
            <Link
                to="/favoriler"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 dark:bg-white/10 text-muted-foreground group-hover:text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary-subtle)] transition-all duration-300 shadow-sm"
                title={t('header.favoritesTitle')}
            >
                <svg viewBox="0 0 24 24" className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 ${favoriteCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    <path
                        fill="currentColor"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                    <path
                        fill="white"
                        fillOpacity="0.2"
                        d="M12 5.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35C12 21.35 12 21.35 12 21.35z"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </svg>
                {favoriteCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-background">
                        {favoriteCount}
                    </span>
                )}
            </Link>
            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-[var(--brand-primary)] mt-1 transition-colors">
            {t('header.favorites')}
            </span>
        </div>
    );
}
