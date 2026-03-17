import { useEffect } from 'react';
import { useBasketUiStore } from '../../../store/basketUiStore';
import { useBasket } from '../hooks/useBasket';
import { BasketItemRow } from './BasketItemRow';
import { BasketSummary } from './BasketSummary';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BasketDrawer = () => {
    const { t } = useTranslation('basket');
    const { isDrawerOpen, closeDrawer } = useBasketUiStore();
    const { data: basket, isLoading, isError } = useBasket();
    const navigate = useNavigate();

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isDrawerOpen) {
                closeDrawer();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isDrawerOpen, closeDrawer]);

    if (!isDrawerOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-zinc-950 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold">{t('drawer.title')}</h2>
                    <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : isError ? (
                        <div className="flex justify-center items-center h-full text-red-500">
                            {t('drawer.loadError')}
                        </div>
                    ) : !basket || !basket.items || basket.items.length === 0 ? (
                        <div className="py-12">
                            <EmptyState title={t('drawer.empty')} description={t('drawer.emptyDesc')} />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {(basket?.items || []).map(item => (
                                <BasketItemRow key={item.productId} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {basket && basket.items && basket.items.length > 0 && (
                    <div className="border-t">
                        <BasketSummary basket={basket} />
                        <div className="p-4 pt-0 bg-gray-50 dark:bg-zinc-900">
                            <button
                                className="w-full py-3 px-4 text-base font-bold text-white rounded-lg bg-[var(--brand-primary)] border-b-4 border-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg transition-all duration-150 active:translate-y-1 active:border-b-0"
                                onClick={() => {
                                    closeDrawer();
                                    navigate('/checkout'); // Placeholder
                                }}
                            >
                                {t('drawer.checkout')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
