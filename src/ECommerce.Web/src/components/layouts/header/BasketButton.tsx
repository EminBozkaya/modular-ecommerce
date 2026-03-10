import { ShoppingCart } from 'lucide-react';
import { useBasket } from '@/features/basket/hooks/useBasket';
import { useBasketUiStore } from '@/store/basketUiStore';

export function BasketButton() {
    const { data: basket, isLoading: isBasketLoading } = useBasket();
    const { openDrawer } = useBasketUiStore();
    const itemCount = basket?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <button
            onClick={openDrawer}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-muted-foreground hover:text-[var(--color-ebrar-green)] hover:bg-green-50 transition-all duration-300"
            aria-label="Sepeti ac"
            title="Sepetim"
        >
            <ShoppingCart className="h-5 w-5" />
            {!isBasketLoading && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-white">
                    {itemCount}
                </span>
            )}
        </button>
    );
}
