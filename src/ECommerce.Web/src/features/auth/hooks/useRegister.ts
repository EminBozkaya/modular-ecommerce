import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '@/features/auth/api/authApi';
import type { RegisterRequest, AuthResponse } from '@/features/auth/types/auth';
import { useAuthStore } from '@/store/authStore';
import { type ApiError, parseApiError } from '@/api/errorHandling';

export function useRegister() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation<AuthResponse, ApiError, RegisterRequest>({
        mutationFn: async (data: RegisterRequest) => {
            try {
                return await register(data);
            } catch (err) {
                throw parseApiError(err);
            }
        },
        onSuccess: (response) => {
            setUser(response.user);
            navigate('/');
        },
    });
}
