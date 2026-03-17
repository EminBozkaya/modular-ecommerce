import { Loader2 } from 'lucide-react';
import { useAddToBasket } from '../hooks/useAddToBasket';

interface AddToBasketButtonProps {
    productId: string;
    disabled?: boolean;
}

export const AddToBasketButton = ({ productId, disabled }: AddToBasketButtonProps) => {
    const { mutate: addToBasket, isPending, isSuccess, isError } = useAddToBasket();

    if (disabled) {
        return (
            <button
                disabled
                className="w-full py-2.5 px-4 text-sm font-bold bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed border-b-2 border-gray-200"
            >
                Stokta Yok
            </button>
        );
    }

    if (isSuccess) {
        return (
            <button
                disabled
                className="w-full py-2.5 px-4 text-sm font-bold bg-green-500 text-white rounded-lg border-b-4 border-green-700 shadow-sm"
            >
                Eklendi ✓
            </button>
        );
    }

    return (
        <button
            onClick={() => addToBasket({ productId, quantity: 1 })}
            disabled={isPending}
            className={`
                w-full py-2.5 px-4 text-sm font-bold text-white rounded-lg 
                transition-all duration-150 active:translate-y-1 active:border-b-0
                ${isError
                    ? 'bg-red-500 border-b-4 border-red-700 hover:bg-red-600'
                    : 'bg-[var(--brand-primary)] border-b-4 border-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg'
                }
                disabled:opacity-70 disabled:cursor-wait
            `}
        >
            {isPending ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Ekleniyor...
                </span>
            ) : isError ? (
                'Tekrar Dene'
            ) : (
                'Sepete Ekle'
            )}
        </button>
    );
};
