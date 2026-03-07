import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '@/features/auth/api/authApi';
import type { LoginRequest, AuthResponse } from '@/features/auth/types/auth';
import { useAuthStore } from '@/store/authStore';
import { queryKeys } from '@/utils/queryKeys';
import type { ApiError } from '@/api/errorHandling';

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation<AuthResponse, ApiError, LoginRequest>({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (response) => {
            setUser(response.user);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
            queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
            navigate('/');
        },
    });
}
