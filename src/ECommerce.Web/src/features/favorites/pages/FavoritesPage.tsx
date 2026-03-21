import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist, useToggleFavorite } from '../hooks/useFavorites';
import { formatPrice } from '../../../utils/formatters';
import { AddToBasketButton } from '../../basket/components/AddToBasketButton';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

export default function FavoritesPage() {
    const { data: items, isLoading, isError } = useWishlist();
    const { toggle, isLoading: isToggling } = useToggleFavorite();

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
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Favorilerim</h1>
                <p className="text-muted-foreground mb-6">
                    Henüz favori ürününüz bulunmamaktadır.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[var(--brand-primary)] rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors"
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
                <h1 className="text-2xl font-bold text-foreground">
                    Favorilerim ({items.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => {
                    const inStock = item.stockQuantity > 0 && item.isActive;
                    return (
                        <div
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-shadow duration-300 relative"
                        >
                            {/* Remove from favorites */}
                            <button
                                onClick={() => toggle(item.productId, true)}
                                disabled={isToggling}
                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/90 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Favorilerden Kaldır"
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </button>

                            <Link
                                to={`/products/${item.productId}`}
                                className="aspect-square w-full overflow-hidden bg-accent flex items-center justify-center"
                            >
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                                        <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm">Görsel yok</span>
                                    </div>
                                )}
                            </Link>

                            <div className="flex flex-1 flex-col p-4 space-y-2">
                                <p className="text-sm text-muted-foreground font-medium">
                                    {item.categoryName}
                                </p>
                                <h3 className="text-base font-semibold text-foreground group-hover:text-[var(--brand-primary)]">
                                    <Link to={`/products/${item.productId}`}>
                                        {item.productName}
                                    </Link>
                                </h3>
                                <div className="flex-1 flex flex-col justify-end">
                                    <p className="text-lg font-bold text-foreground">
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
