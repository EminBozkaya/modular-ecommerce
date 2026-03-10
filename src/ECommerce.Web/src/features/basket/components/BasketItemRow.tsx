import { Trash2 } from 'lucide-react';
import type { BasketItem } from '../types/basket';
import { useRemoveFromBasket } from '../hooks/useRemoveFromBasket';
import { useUpdateBasketItem } from '../hooks/useUpdateBasketItem';
import { formatPrice } from '../../../utils/formatters';
import { getUnitConfig } from '../../../utils/unitConfig';
import { QuantitySelector } from '../../../components/shared/QuantitySelector';

interface BasketItemRowProps {
    item: BasketItem;
}

export const BasketItemRow = ({ item }: BasketItemRowProps) => {
    const { mutate: removeFromBasket, isPending: isRemoving } = useRemoveFromBasket();
    const { debouncedMutate: updateItem, isPending: isUpdating } = useUpdateBasketItem();

    const unitName = item.unitName ?? 'adet';
    const unitConfig = getUnitConfig(unitName);

    const handleQuantityChange = (newValue: number) => {
        if (newValue <= 0) {
            removeFromBasket(item.productId);
        } else {
            updateItem({ productId: item.productId, quantity: newValue });
        }
    };

    const isDisabled = isRemoving || isUpdating;

    return (
        <div className="flex items-center gap-4 py-4 px-4 border-b last:border-b-0">
            {/* Image */}
            <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs text-center">
                        Görsel yok
                    </div>
                )}
            </div>

            {/* Name + unit label + quantity selector */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h4>
                <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {unitConfig.displayName}
                </span>
                <div>
                    <QuantitySelector
                        unitName={unitName}
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        disabled={isDisabled}
                        size="sm"
                    />
                </div>
                <button
                    onClick={() => removeFromBasket(item.productId)}
                    disabled={isDisabled}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50 mt-0.5"
                    aria-label="Ürünü sepetten kaldır"
                >
                    <Trash2 className="h-3 w-3" />
                    Kaldır
                </button>
            </div>

            {/* Price column */}
            <div className="text-right flex-shrink-0 space-y-1">
                <p className="text-xs text-gray-400">
                    {formatPrice(item.unitPriceSnapshot, item.currency)} / {unitName}
                </p>
                <p className="text-sm font-bold text-gray-900">
                    {formatPrice(item.unitPriceSnapshot * item.quantity, item.currency)}
                </p>
            </div>
        </div>
    );
};
