import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../types/product';
import { formatPrice } from '../../../utils/formatters';
import { AddToBasketButton } from '../../basket/components/AddToBasketButton';
import { useWishlistProductIds, useToggleFavorite } from '../../favorites/hooks/useFavorites';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const inStock = product.stockQuantity > 0;
    const { data: wishlistIds, isError: isWishlistError } = useWishlistProductIds();
    const { toggle, isLoading: isToggling } = useToggleFavorite();
    const isFavorited = wishlistIds?.includes(product.id) ?? false;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isToggling || isWishlistError) return;
        toggle(product.id, isFavorited);
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white hover:shadow-2xl hover:border-[var(--color-ebrar-green-light)] transition-all duration-500">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <Link to={`/products/${product.id}`} className="block w-full h-full">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                            <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-serif italic">Görsel bulunamadı</span>
                        </div>
                    )}
                </Link>

                <div className="absolute top-3 right-3 flex flex-col items-center gap-2 z-10">
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isToggling || isWishlistError}
                        className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 ${isFavorited
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
                            }`}
                        title={isFavorited ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
                    >
                        <Heart
                            className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-current' : ''
                                }`}
                        />
                    </button>
                    {inStock && (
                        <span className="inline-flex items-center rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                            Stokta
                        </span>
                    )}
                    {!inStock && (
                        <span className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                            Tükendi
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="space-y-1">
                    <p className="text-xs font-serif italic text-[var(--color-ebrar-green)] tracking-wide">
                        {product.categoryName}
                    </p>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
                        <Link to={`/products/${product.id}`} className="hover:text-[var(--color-ebrar-green)] transition-colors duration-300">
                            {product.name}
                        </Link>
                    </h3>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-2xl font-black text-gray-900 font-serif">
                        {formatPrice(product.price, product.currency)}
                    </span>
                </div>

                <div className="pt-2">
                    <div onClick={(e) => e.stopPropagation()} className="relative z-20">
                        <AddToBasketButton
                            productId={product.id}
                            disabled={!inStock}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
