import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/api/errorHandling';

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const clearUser = useAuthStore((state) => state.clearUser);

    return useMutation<void, ApiError, void>({
        mutationFn: () => logout(),
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            navigate('/login');
        },
    });
}
