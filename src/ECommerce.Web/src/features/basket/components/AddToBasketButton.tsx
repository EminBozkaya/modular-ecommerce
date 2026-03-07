import { Loader2 } from 'lucide-react';
import { useAddToBasket } from '../hooks/useAddToBasket';
import { Button } from '../../../components/ui/button'; // Assuming shadcn UI Button exists

interface AddToBasketButtonProps {
    productId: string;
    disabled?: boolean;
}

export const AddToBasketButton = ({ productId, disabled }: AddToBasketButtonProps) => {
    const { mutate: addToBasket, isPending, isSuccess, isError } = useAddToBasket();

    if (disabled) {
        return (
            <Button disabled className="w-full" variant="secondary">
                Out of Stock
            </Button>
        );
    }

    if (isSuccess) {
        return (
            <Button disabled className="w-full bg-green-600 hover:bg-green-700 text-white">
                Added ✓
            </Button>
        );
    }

    return (
        <Button
            onClick={() => addToBasket({ productId, quantity: 1 })}
            disabled={isPending}
            className="w-full"
            variant={isError ? "destructive" : "default"}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
            ) : isError ? (
                'Try Again'
            ) : (
                'Add to Basket'
            )}
        </Button>
    );
};
