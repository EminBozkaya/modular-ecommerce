import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useWishlist, useToggleFavorite } from '../hooks/useFavorites';
import { formatPrice } from '../../../utils/formatters';
import { calculateLinePrice } from '../../../utils/priceCalculator';
import { getUnitConfig } from '../../../utils/unitConfig';
import { QuantitySelector } from '../../../components/shared/QuantitySelector';
import { useBasket } from '../../basket/hooks/useBasket';
import { useAddToBasket } from '../../basket/hooks/useAddToBasket';
import { useRemoveFromBasket } from '../../basket/hooks/useRemoveFromBasket';
import { useUpdateBasketItem } from '../../basket/hooks/useUpdateBasketItem';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import type { WishlistItem } from '../types/favorite';
import { useTranslation } from 'react-i18next';

// Per-card logic extracted so each card manages its own quantity state
function FavoriteCard({ item, onRemove, isRemoving }: {
    item: WishlistItem;
    onRemove: () => void;
    isRemoving: boolean;
}) {
    const { t } = useTranslation('catalog');
    const unitConfig = getUnitConfig(item.unitCode, item.unitName);
    const [quantity, setQuantity] = useState<number>(Math.max(unitConfig.min, 1));

    const inStock = item.stockQuantity > 0 && item.isActive;

    const { data: basket } = useBasket();
    const { mutate: addToBasket, isPending: isAdding, isSuccess: isAddSuccess } = useAddToBasket();
    const { mutate: removeFromBasket, isPending: isRemovingFromBasket } = useRemoveFromBasket();
    const { debouncedMutate: updateBasketItem, isPending: isUpdating } = useUpdateBasketItem();

    const basketItem = basket?.items?.find((bi) => bi.productId === item.productId);
    const isInBasket = !!basketItem;
    const currentQuantity = isInBasket ? basketItem.quantity : quantity;
    const isAnyActionPending = isAdding || isRemovingFromBasket || isUpdating;

    // Stock validation — uses already-loaded data, no extra API call
    const exceedsStock = !isInBasket && item.stockQuantity > 0 && currentQuantity > item.stockQuantity;

    const handleAddToBasket = () => {
        if (isInBasket) {
            removeFromBasket(item.productId);
        } else {
            addToBasket({ productId: item.productId, quantity });
        }
    };

    const handleQuantityChange = (newQty: number) => {
        if (isInBasket) {
            updateBasketItem({ productId: item.productId, quantity: newQty });
        } else {
            setQuantity(newQty);
        }
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:shadow-2xl hover:border-[var(--brand-primary-light)] transition-all duration-500 relative">
            {/* Remove from favorites */}
            <button
                onClick={onRemove}
                disabled={isRemoving}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/90 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                title="Favorilerden Kaldır"
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </button>

            {/* Product image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-white/10">
                <Link to={`/products/${item.productId}`} className="block w-full h-full">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                            <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-serif italic">{t('product.noImage')}</span>
                        </div>
                    )}
                </Link>

                {/* Price overlay */}
                <div className="absolute bottom-0 right-0 z-10 bg-black/60 backdrop-blur-sm rounded-tl-xl px-3 py-1.5">
                    <span className="text-lg font-black text-white font-serif">
                        {formatPrice(item.price, item.currency)}
                    </span>
                    <span className="text-[10px] text-white/70 ml-0.5">/ {item.unitName}</span>
                </div>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col px-4 py-3 gap-2">
                <div>
                    <p className="text-[11px] font-serif italic text-[var(--brand-primary)] tracking-wide leading-none">
                        {item.categoryName}
                    </p>
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug mt-0.5">
                        <Link to={`/products/${item.productId}`} className="hover:text-[var(--brand-primary)] transition-colors duration-300">
                            {item.productName}
                        </Link>
                    </h3>
                </div>

                {/* Quantity + add to basket (in-stock) */}
                {inStock && (
                    <div onClick={(e) => e.stopPropagation()} className="relative z-20 flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2">
                            <QuantitySelector
                                unitCode={item.unitCode}
                                unitName={item.unitName}
                                value={currentQuantity}
                                onChange={handleQuantityChange}
                                disabled={isAnyActionPending}
                                size="sm"
                            />
                            <span className="text-sm font-black text-[var(--brand-primary)] tabular-nums whitespace-nowrap">
                                {calculateLinePrice(item.price, currentQuantity, item.currency)}
                            </span>
                        </div>

                        {/* Stock warning */}
                        {exceedsStock && (
                            <p className="text-xs font-bold text-red-500 text-center -mt-1">
                                {t('product.stockExceeded', { stock: item.stockQuantity, unit: item.unitName })}
                            </p>
                        )}

                        <button
                            onClick={handleAddToBasket}
                            disabled={isAnyActionPending || exceedsStock}
                            className={[
                                'w-full py-2 px-3 text-sm font-bold text-white rounded-lg cursor-pointer',
                                'transition-all duration-150 active:translate-y-0.5 active:border-b-0',
                                isInBasket
                                    ? 'bg-red-600 border-b-3 border-red-800 hover:bg-red-700'
                                    : isAddSuccess
                                        ? 'bg-green-600 border-b-3 border-green-800'
                                        : 'bg-[var(--brand-primary)] border-b-3 border-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg',
                                'disabled:opacity-70 disabled:cursor-not-allowed',
                            ].join(' ')}
                        >
                            {isAnyActionPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> {t('product.waiting')}
                                </span>
                            ) : isInBasket ? (
                                <span className="flex items-center justify-center gap-2">
                                    <ShoppingCart className="h-4 w-4 fill-white/20" /> {t('product.removeFromBasket')}
                                </span>
                            ) : isAddSuccess ? (
                                t('product.added')
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <ShoppingCart className="h-4 w-4" /> {t('product.addToBasket')}
                                </span>
                            )}
                        </button>
                    </div>
                )}

                {/* Out of stock */}
                {!inStock && (
                    <button
                        disabled
                        className="w-full py-2 px-3 text-sm font-bold bg-accent text-muted-foreground rounded-lg cursor-not-allowed border-b-2 border-border"
                    >
                        {t('product.outOfStock')}
                    </button>
                )}
            </div>
        </div>
    );
}

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
                {items.map((item) => (
                    <FavoriteCard
                        key={item.id}
                        item={item}
                        onRemove={() => toggle(item.productId, true)}
                        isRemoving={isToggling}
                    />
                ))}
            </div>
        </div>
    );
}
