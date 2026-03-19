import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';
import { formatPrice } from '../../../utils/formatters';
import { calculateLinePrice } from '../../../utils/priceCalculator';
import { getUnitConfig } from '../../../utils/unitConfig';
import { QuantitySelector } from '../../../components/shared/QuantitySelector';
import { useAddToBasket } from '../../basket/hooks/useAddToBasket';
import { useBasket } from '../../basket/hooks/useBasket';
import { useRemoveFromBasket } from '../../basket/hooks/useRemoveFromBasket';
import { useUpdateBasketItem } from '../../basket/hooks/useUpdateBasketItem';
import { useWishlistProductIds, useToggleFavorite } from '../../favorites/hooks/useFavorites';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { t } = useTranslation('catalog');
    const unitConfig = getUnitConfig(product.unitCode, product.unitName);
    const [quantity, setQuantity] = useState<number>(Math.max(unitConfig.min, 1));

    const inStock = product.stockQuantity > 0;
    const { data: wishlistIds, isError: isWishlistError } = useWishlistProductIds();
    const { toggle, isLoading: isToggling } = useToggleFavorite();
    const isFavorited = wishlistIds?.includes(product.id) ?? false;

    // Basket Hooks
    const { data: basket } = useBasket();
    const { mutate: addToBasket, isPending: isAdding, isSuccess: isAddSuccess } = useAddToBasket();
    const { mutate: removeFromBasket, isPending: isRemoving } = useRemoveFromBasket();
    const { debouncedMutate: updateBasketItem, isPending: isUpdating } = useUpdateBasketItem();

    const basketItem = basket?.items?.find((item) => item.productId === product.id);
    const isInBasket = !!basketItem;

    // Use local quantity for items NOT in basket
    // For items IN basket, we use the quantity from the basket state
    const currentQuantity = isInBasket ? basketItem.quantity : quantity;
    const isAnyActionPending = isAdding || isRemoving || isUpdating;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isToggling || isWishlistError) return;
        toggle(product.id, isFavorited);
    };

    const handleAddToBasket = () => {
        if (isInBasket) {
            removeFromBasket(product.id);
        } else {
            addToBasket({ productId: product.id, quantity });
        }
    };

    const handleQuantityChange = (newQty: number) => {
        if (isInBasket) {
            updateBasketItem({ productId: product.id, quantity: newQty });
        } else {
            setQuantity(newQty);
        }
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:shadow-2xl hover:border-[var(--brand-primary-light)] transition-all duration-500">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-white/10">
                <Link to={`/products/${product.id}`} className="block w-full h-full">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
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

                <button
                    onClick={handleToggleFavorite}
                    disabled={isToggling || isWishlistError}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 ${isFavorited
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-muted-foreground hover:text-red-500 hover:bg-white'
                        }`}
                    title={isFavorited ? t('product.removeFromFavorites') : t('product.addToFavorites')}
                >
                    <Heart className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                {/* Price overlay on bottom-right of image */}
                <div className="absolute bottom-0 right-0 z-10 bg-black/60 backdrop-blur-sm rounded-tl-xl px-3 py-1.5">
                    <span className="text-lg font-black text-white font-serif">
                        {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-[10px] text-white/70 ml-0.5">/ {product.unitName}</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-4 py-3 gap-2">
                <div>
                    <p className="text-[11px] font-serif italic text-[var(--brand-primary)] tracking-wide leading-none">
                        {product.categoryName}
                    </p>
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug mt-0.5">
                        <Link to={`/products/${product.id}`} className="hover:text-[var(--brand-primary)] transition-colors duration-300">
                            {product.name}
                        </Link>
                    </h3>
                </div>

                {inStock && (
                    <div onClick={(e) => e.stopPropagation()} className="relative z-20 flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2">
                            <QuantitySelector
                                unitCode={product.unitCode}
                                unitName={product.unitName}
                                value={currentQuantity}
                                onChange={handleQuantityChange}
                                disabled={isAnyActionPending}
                                size="sm"
                            />
                            <span className="text-sm font-black text-[var(--brand-primary)] tabular-nums whitespace-nowrap">
                                {calculateLinePrice(product.price, currentQuantity, product.currency)}
                            </span>
                        </div>
                        <button
                            onClick={handleAddToBasket}
                            disabled={isAnyActionPending}
                            className={[
                                'w-full py-2 px-3 text-sm font-bold text-white rounded-lg',
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
