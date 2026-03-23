import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBasketItem } from '../api/basketApi';
import { queryKeys } from '@/utils/queryKeys';
import type { UpdateBasketItemRequest, Basket } from '../types/basket';
import type { ApiError } from '@/api/errorHandling';

const DEBOUNCE_MS = 300;

export function useUpdateBasketItem() {
    const queryClient = useQueryClient();

    const mutation = useMutation<Basket, ApiError, UpdateBasketItemRequest>({
        mutationFn: updateBasketItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
        },
    });

    // Debounced trigger — returns a function that delays sending until user pauses
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedMutate = (req: UpdateBasketItemRequest) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            mutation.mutate(req);
        }, DEBOUNCE_MS);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        debouncedMutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
    };
}
