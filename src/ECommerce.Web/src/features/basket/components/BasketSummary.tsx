import type { Basket } from '../types/basket';
import { formatPrice } from '../../../utils/formatters';
import { useTranslation } from 'react-i18next';

interface BasketSummaryProps {
    basket: Basket;
}

export const BasketSummary = ({ basket }: BasketSummaryProps) => {
    const { t } = useTranslation('basket');
    const itemCount = basket?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <div className="flex flex-col gap-2 p-4 border-t bg-gray-50 dark:bg-zinc-900">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('summary.products', { count: itemCount })}</span>
                <span>{formatPrice(basket.totalAmount, basket.currency)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
                <span>{t('summary.total')}</span>
                <span>{formatPrice(basket.totalAmount, basket.currency)}</span>
            </div>
        </div>
    );
};
