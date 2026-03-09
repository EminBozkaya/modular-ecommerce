import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist, useToggleFavorite } from '../hooks/useFavorites';
import { useAuthStore } from '../../../store/authStore';
import { formatPrice } from '../../../utils/formatters';
import { AddToBasketButton } from '../../basket/components/AddToBasketButton';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

export default function FavoritesPage() {
    const { isAuthenticated } = useAuthStore();
    const { data: items, isLoading, isError } = useWishlist();
    const { toggle, isLoading: isToggling } = useToggleFavorite();

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Favorilerim</h1>
                <p className="text-gray-500 mb-6">
                    Favori ürünlerinizi görmek için giriş yapmanız gerekmektedir.
                </p>
                <Link
                    to="/login?redirect=/favoriler"
                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-[var(--color-ebrar-green)] rounded-lg hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                >
                    Giriş Yap
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-red-500">Favoriler yüklenirken bir hata oluştu.</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Favorilerim</h1>
                <p className="text-gray-500 mb-6">
                    Henüz favori ürününüz bulunmamaktadır.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-ebrar-green)] rounded-lg hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                >
                    <ShoppingCart className="h-4 w-4" />
                    Ürünlere Göz At
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                    Favorilerim ({items.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => {
                    const inStock = item.stockQuantity > 0 && item.isActive;
                    return (
                        <div
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300 relative"
                        >
                            {/* Remove from favorites */}
                            <button
                                onClick={() => toggle(item.productId, true)}
                                disabled={isToggling}
                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow-md hover:bg-red-50 transition-colors"
                                title="Favorilerden Kaldır"
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </button>

                            <Link
                                to={`/products/${item.productId}`}
                                className="aspect-square w-full overflow-hidden bg-gray-100 flex items-center justify-center"
                            >
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                                        <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm">Görsel yok</span>
                                    </div>
                                )}
                            </Link>

                            <div className="flex flex-1 flex-col p-4 space-y-2">
                                <p className="text-sm text-gray-500 font-medium">
                                    {item.categoryName}
                                </p>
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-[var(--color-ebrar-green)]">
                                    <Link to={`/products/${item.productId}`}>
                                        {item.productName}
                                    </Link>
                                </h3>
                                <div className="flex-1 flex flex-col justify-end">
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatPrice(item.price, item.currency)}
                                    </p>
                                </div>
                                {!inStock && (
                                    <p className="text-xs text-red-500 font-medium">Stokta yok</p>
                                )}
                                <div className="mt-4">
                                    <AddToBasketButton productId={item.productId} disabled={!inStock} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
