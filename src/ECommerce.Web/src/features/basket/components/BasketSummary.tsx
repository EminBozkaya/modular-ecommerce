import type { Basket } from '../types/basket';
import { formatPrice } from '../../../utils/formatters';

interface BasketSummaryProps {
    basket: Basket;
}

export const BasketSummary = ({ basket }: BasketSummaryProps) => {
    const itemCount = basket.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="flex flex-col gap-2 p-4 border-t bg-gray-50 dark:bg-zinc-900">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Items ({itemCount})</span>
                <span>{formatPrice(basket.totalAmount, basket.currency)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(basket.totalAmount, basket.currency)}</span>
            </div>
        </div>
    );
};
