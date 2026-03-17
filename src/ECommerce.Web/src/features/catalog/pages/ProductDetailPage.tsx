import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { formatPrice } from '../../../utils/formatters';
import { calculateLinePrice } from '../../../utils/priceCalculator';
import { getUnitConfig } from '../../../utils/unitConfig';
import { QuantitySelector } from '../../../components/shared/QuantitySelector';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useAddToBasket } from '../../basket/hooks/useAddToBasket';
import { useBasket } from '../../basket/hooks/useBasket';
import { useRemoveFromBasket } from '../../basket/hooks/useRemoveFromBasket';
import { useUpdateBasketItem } from '../../basket/hooks/useUpdateBasketItem';
import { useTranslation } from 'react-i18next';

export default function ProductDetailPage() {
    const { t } = useTranslation('catalog');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const safeId = id ?? '';

    const { data: product, isLoading, error, refetch } = useProduct(safeId);
    
    // Basket Hooks
    const { data: basket } = useBasket();
    const { mutate: addToBasket, isPending: isAdding, isSuccess: isAddSuccess } = useAddToBasket();
    const { mutate: removeFromBasket, isPending: isRemoving } = useRemoveFromBasket();
    const { debouncedMutate: updateBasketItem, isPending: isUpdating } = useUpdateBasketItem();

    const basketItem = basket?.items?.find((item) => item.productId === safeId);
    const isInBasket = !!basketItem;
    const isAnyActionPending = isAdding || isRemoving || isUpdating;

    // quantity is initialised after product loads; default to 1 until then
    const unitConfig = product ? getUnitConfig(product.unitName) : null;
    const [quantity, setQuantity] = useState<number>(1);

    // Sync quantity min when product first loads
    const [syncedUnit, setSyncedUnit] = useState<string | null>(null);
    if (product && unitConfig && syncedUnit !== product.unitName) {
        setSyncedUnit(product.unitName);
        setQuantity(unitConfig.min);
    }

    const currentQuantity = isInBasket ? basketItem.quantity : quantity;

    const handleQuantityChange = (newQty: number) => {
        if (isInBasket) {
            updateBasketItem({ productId: safeId, quantity: newQty });
        } else {
            setQuantity(newQty);
        }
    };

    const handleBasketAction = () => {
        if (isInBasket) {
            removeFromBasket(safeId);
        } else {
            addToBasket({ productId: safeId, quantity });
        }
    };

    const handleBack = () => navigate('/products');

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground font-medium">{t('detail.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <button onClick={handleBack} className="mb-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('detail.backToProducts')}
                </button>
                <ErrorMessage
                    message={error instanceof Error ? error.message : t('detail.loadError')}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <button onClick={handleBack} className="mb-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('detail.backToProducts')}
                </button>
                <EmptyState title={t('detail.notFound')} description={t('detail.notFoundDesc')} />
            </div>
        );
    }

    const inStock = product.stockQuantity > 0;
    const config = getUnitConfig(product.unitName);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <button onClick={handleBack} className="mb-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('detail.backToProducts')}
            </button>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/2 p-8 md:p-12 bg-gray-50 dark:bg-white/10 flex items-center justify-center md:border-r border-border min-h-[400px]">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-w-full h-auto object-contain max-h-[500px] hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <svg className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-lg font-medium">{t('detail.noImage')}</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm font-bold tracking-wider text-blue-500 uppercase">
                                {product.categoryName}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {product.name}
                        </h1>

                        {/* Unit info */}
                        <p className="text-sm text-muted-foreground mb-2">
                            {t('detail.salesUnit')}{' '}
                            <span className="font-semibold text-foreground">{config.displayName}</span>
                        </p>

                        <div className="flex items-end mb-4">
                            <span className="text-3xl font-extrabold text-foreground">
                                {formatPrice(product.price, product.currency)}
                            </span>
                            <span className="ml-2 text-base text-muted-foreground">/ {product.unitName}</span>
                        </div>

                        <div className="mb-6 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${inStock ? 'bg-green-50 dark:bg-green-900/20 text-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-800'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {inStock ? t('detail.inStock') : t('detail.outOfStock')}
                            </span>
                            {inStock && (
                                <span className="text-sm font-medium text-muted-foreground border border-border py-1 px-3 rounded-full">
                                    {t('detail.stockAvailable', { count: product.stockQuantity, unit: product.unitName })}
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none mb-8 flex-1">
                            <p className="leading-relaxed">{product.description}</p>
                        </div>

                        {inStock && (
                            <div className="pt-6 border-t border-border mt-auto space-y-4">
                                {/* Quantity selector */}
                                <div>
                                    <p className="text-sm font-medium text-foreground mb-2">{t('detail.selectQuantity')}</p>
                                    <QuantitySelector
                                        unitName={product.unitName}
                                        value={currentQuantity}
                                        onChange={handleQuantityChange}
                                        disabled={isAnyActionPending}
                                        size="md"
                                    />
                                </div>

                                {/* Price preview card */}
                                <div className="rounded-xl border border-border bg-gray-50 dark:bg-white/10 p-4 space-y-1.5">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{t('detail.selectedQuantity')}</span>
                                        <span className="font-semibold text-foreground">{config.formatValue(currentQuantity)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{t('detail.unitPrice')}</span>
                                        <span className="font-semibold text-foreground">
                                            {formatPrice(product.price, product.currency)} / {product.unitName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-foreground pt-1 border-t border-border mt-1">
                                        <span>{t('detail.estimatedTotal')}</span>
                                        <span>{calculateLinePrice(product.price, currentQuantity, product.currency)}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground pt-0.5">
                                        {t('detail.pricingNote')}
                                    </p>
                                </div>

                                {/* Add to basket */}
                                <button
                                    onClick={handleBasketAction}
                                    disabled={isAnyActionPending}
                                    className={[
                                        'w-full py-3 px-4 text-base font-bold text-white rounded-lg',
                                        'transition-all duration-150 active:translate-y-1 active:border-b-0',
                                        isInBasket
                                            ? 'bg-red-600 border-b-4 border-red-800 hover:bg-red-700'
                                            : isAddSuccess
                                                ? 'bg-green-600 border-b-4 border-green-800'
                                                : 'bg-[var(--brand-primary)] border-b-4 border-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg',
                                        'disabled:opacity-70 disabled:cursor-not-allowed',
                                    ].join(' ')}
                                >
                                    {isAnyActionPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-5 v-5 animate-spin" /> {t('product.waiting')}
                                        </span>
                                    ) : isInBasket ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="h-5 w-5 fill-white/20" /> {t('product.removeFromBasket')}
                                        </span>
                                    ) : isAddSuccess ? (
                                        t('product.basketAdded')
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="h-5 w-5" /> {t('product.addToBasket')}
                                        </span>
                                    )}
                                </button>
                                <p className="text-xs text-center text-muted-foreground">
                                    {t('detail.freeShipping')}
                                </p>
                            </div>
                        )}

                        {!inStock && (
                            <div className="pt-6 border-t border-border mt-auto">
                                <button disabled className="w-full py-3 px-4 text-base font-bold bg-accent text-muted-foreground rounded-lg cursor-not-allowed border-b-2 border-border">
                                    {t('detail.outOfStock')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
