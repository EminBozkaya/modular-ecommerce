import { Loader2, Trash2 } from 'lucide-react';
import type { BasketItem } from '../types/basket';
import { useRemoveFromBasket } from '../hooks/useRemoveFromBasket';
import { formatPrice } from '../../../utils/formatters';
import { Button } from '../../../components/ui/button';

interface BasketItemRowProps {
    item: BasketItem;
}

export const BasketItemRow = ({ item }: BasketItemRowProps) => {
    const { mutate: removeFromBasket, isPending } = useRemoveFromBasket();

    return (
        <div className="flex items-center gap-4 py-4 border-b">
            <div className="h-16 w-16 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-md overflow-hidden">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.productName}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                    {formatPrice(item.unitPriceSnapshot, item.currency)} x {item.quantity}
                </p>
                <div className="mt-1 text-sm font-medium">
                    {formatPrice(item.unitPriceSnapshot * item.quantity, item.currency)}
                </div>
            </div>

            <div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromBasket(item.productId)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label="Remove item"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};
