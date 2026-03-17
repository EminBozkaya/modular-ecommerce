import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useBasket } from '../hooks/useBasket';
import { BasketItemRow } from '../components/BasketItemRow';
import { BasketSummary } from '../components/BasketSummary';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';

export default function BasketPage() {
    const { data: basket, isLoading, isError } = useBasket();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-16">
                <ErrorMessage message="Sepet yüklenirken bir hata oluştu." />
            </div>
        );
    }

    if (!basket || !basket.items || basket.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Sepetim</h1>
                <EmptyState
                    title="Sepetiniz boş"
                    description="Henüz bir ürün eklemediniz."
                />
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-semibold text-white bg-[var(--brand-primary)] rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors"
                >
                    <ShoppingCart className="h-4 w-4" />
                    Ürünlere Göz At
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <ShoppingCart className="h-6 w-6 text-[var(--brand-primary)]" />
                <h1 className="text-2xl font-bold text-foreground">
                    Sepetim ({basket.items.reduce((acc, item) => acc + item.quantity, 0)} ürün)
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
                    {basket.items.map(item => (
                        <BasketItemRow key={item.productId} item={item} />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <BasketSummary basket={basket} />
                    </div>
                    <button
                        className="w-full py-3 px-4 text-base font-bold text-white rounded-lg bg-[var(--brand-primary)] border-b-4 border-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg transition-all duration-150 active:translate-y-1 active:border-b-0"
                        onClick={() => navigate('/checkout')}
                    >
                        Ödemeye Geç
                    </button>
                </div>
            </div>
        </div>
    );
}
