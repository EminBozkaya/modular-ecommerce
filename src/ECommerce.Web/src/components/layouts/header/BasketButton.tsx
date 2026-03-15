import { useNavigate } from 'react-router-dom';
import { useBasket } from '@/features/basket/hooks/useBasket';
import { useTranslation } from 'react-i18next';

export function BasketButton() {
    const { data: basket, isLoading: isBasketLoading } = useBasket();
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const itemCount = basket?.items?.length || 0;
    const totalAmount = basket?.totalAmount || 0;
    const currencySymbol = basket?.currency === 'TRY' ? '₺' : (basket?.currency === 'USD' ? '$' : (basket?.currency || '₺'));

    return (
        <div className="flex flex-col items-center group">
            <button
                onClick={() => navigate('/basket')}
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-muted-foreground group-hover:text-[var(--color-ebrar-green)] group-hover:bg-green-50 transition-all duration-300 shadow-sm"
                aria-label={t('header.openBasket')}
                title={t('header.basketTitle')}
            >
                <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 text-[var(--color-ebrar-green)]">
                    <path
                        fill="currentColor"
                        d="M17 18a2 2 0 110 4 2 2 0 010-4zM7 18a2 2 0 110 4 2 2 0 010-4z"
                    />
                    <path
                        fill="currentColor"
                        d="M7 6l.5 2H19l-1 7H7L5 4H2V2h4l1 4h14l1.5 10H7l-2-10z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                    <rect x="7" y="8" width="12" height="7" fill="currentColor" fillOpacity="0.15" />
                </svg>
                {!isBasketLoading && itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white">
                        {itemCount}
                    </span>
                )}
            </button>
            {!isBasketLoading && (
                <span className="text-[11px] font-bold mt-1 whitespace-nowrap transition-colors">
                    {itemCount > 0 ? (
                        <span className="text-[var(--color-ebrar-green)]">
                            {totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currencySymbol}
                        </span>
                    ) : (
                        <span className="text-muted-foreground group-hover:text-[var(--color-ebrar-green)]">
                            {t('header.basketEmpty')}
                        </span>
                    )}
                </span>
            )}
        </div>
    );
}
