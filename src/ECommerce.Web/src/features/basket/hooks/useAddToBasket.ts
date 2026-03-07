import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToBasket } from '../api/basketApi';
import { queryKeys } from '@/utils/queryKeys';
import { useBasketUiStore } from '@/store/basketUiStore';
import type { AddToBasketRequest } from '../types/basket';
import type { ApiError } from '@/api/errorHandling';

export const useAddToBasket = () => {
    const queryClient = useQueryClient();
    const setLastAdded = useBasketUiStore((state) => state.setLastAdded);

    return useMutation<any, ApiError, AddToBasketRequest>({
        mutationFn: addToBasket,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
            setLastAdded(variables.productId);
            // Auto reset feedback after 1.5s
            setTimeout(() => {
                setLastAdded(null);
            }, 1500);
        },
    });
};
