import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFromBasket } from '../api/basketApi';
import { queryKeys } from '@/utils/queryKeys';
import type { Basket } from '../types/basket';
import type { ApiError } from '@/api/errorHandling';

export const useRemoveFromBasket = () => {
    const queryClient = useQueryClient();

    return useMutation<Basket, ApiError, string>({
        mutationFn: removeFromBasket,
        onMutate: async (productId) => {
            // Cancel any outgoing refetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.basket.current });

            // Snapshot the previous value
            const previousBasket = queryClient.getQueryData<Basket>(queryKeys.basket.current);

            // Optimistically update to the new value
            if (previousBasket) {
                queryClient.setQueryData<Basket>(queryKeys.basket.current, {
                    ...previousBasket,
                    items: previousBasket.items.filter(item => item.productId !== productId),
                    // Assuming totalAmount might be inaccurate during optimistic update,
                    // but we do our best or leave it to be corrected on settled.
                });
            }

            // Return a context object with the snapshotted value
            return { previousBasket };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _newTodo, context) => {
            if (context?.previousBasket) {
                queryClient.setQueryData<Basket>(queryKeys.basket.current, context.previousBasket);
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
        },
    });
};
