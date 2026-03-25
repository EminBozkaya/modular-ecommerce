import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billingAddressApi } from '../api/billingAddressApi';
import { queryKeys } from '../../../utils/queryKeys';
import type { AddUserBillingAddressRequest, UpdateUserBillingAddressRequest } from '../types/address';
import { useAuthStore } from '../../../store/authStore';

export function useBillingAddresses() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return useQuery({
        queryKey: queryKeys.auth.billingAddresses,
        queryFn: () => billingAddressApi.getAll(),
        enabled: isAuthenticated,
    });
}

export function useAddBillingAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: AddUserBillingAddressRequest) => billingAddressApi.add(req),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.billingAddresses }),
    });
}

export function useUpdateBillingAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: UpdateUserBillingAddressRequest }) =>
            billingAddressApi.update(id, req),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.billingAddresses }),
    });
}

export function useDeleteBillingAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => billingAddressApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.billingAddresses }),
    });
}

export function useSetDefaultBillingAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => billingAddressApi.setDefault(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.billingAddresses }),
    });
}
