import type { Basket } from '../../basket/types/basket';
import { formatPrice } from '../../../utils/formatters';

interface OrderSummaryProps {
    basket: Basket;
}

export function OrderSummary({ basket }: OrderSummaryProps) {
    return (
        <div className="rounded-lg border border-border bg-gray-50 p-6">
            <h3 className="text-lg font-semibold mb-4">Siparis Ozeti</h3>

            <div className="space-y-3">
                {basket.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                        <div>
                            <span className="font-medium">{item.productName}</span>
                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span>{formatPrice(item.unitPriceSnapshot * item.quantity, item.currency)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between font-semibold text-base">
                    <span>Toplam</span>
                    <span>{formatPrice(basket.totalAmount, basket.currency)}</span>
                </div>
            </div>
        </div>
    );
}
