import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { queryKeys } from '../../../utils/queryKeys';
import type { AddUserAddressRequest, UpdateUserAddressRequest } from '../types/address';
import { useAuthStore } from '../../../store/authStore'; // Added this import

export function useAddresses() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return useQuery({
        queryKey: queryKeys.auth.addresses,
        queryFn: () => addressApi.getAll(),
        enabled: isAuthenticated,
    });
}

export function useAddAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: AddUserAddressRequest) => addressApi.add(req),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.addresses }),
    });
}

export function useUpdateAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: UpdateUserAddressRequest }) =>
            addressApi.update(id, req),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.addresses }),
    });
}

export function useDeleteAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.addresses }),
    });
}

export function useSetDefaultAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressApi.setDefault(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.addresses }),
    });
}
