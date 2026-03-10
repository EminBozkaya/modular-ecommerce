import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistProductIds } from '@/features/favorites/hooks/useFavorites';

export function FavoriteButton() {
    const { data: wishlistIds } = useWishlistProductIds();
    const favoriteCount = wishlistIds?.length ?? 0;

    return (
        <Link
            to="/favoriler"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-muted-foreground hover:text-[var(--color-ebrar-green)] hover:bg-green-50 transition-all duration-300"
            title="Favorilerim"
        >
            <Heart className="h-5 w-5" />
            {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                    {favoriteCount}
                </span>
            )}
        </Link>
    );
}
