import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword, updateProfile } from '../api/authApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useAuthStore } from '../../../store/authStore';
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types/auth';

export function useUpdateProfile() {
    const qc = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: (req: UpdateProfileRequest) => updateProfile(req),
        onSuccess: (data) => {
            if (user) {
                setUser({
                    ...user,
                    fullName: data.fullName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                });
            }
            qc.invalidateQueries({ queryKey: queryKeys.auth.me });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (req: ChangePasswordRequest) => changePassword(req),
    });
}
