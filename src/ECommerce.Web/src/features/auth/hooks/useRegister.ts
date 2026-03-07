import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '@/features/auth/api/authApi';
import type { RegisterRequest, AuthResponse } from '@/features/auth/types/auth';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/api/errorHandling';

export function useRegister() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation<AuthResponse, ApiError, RegisterRequest>({
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: (response) => {
            setUser(response.user);
            navigate('/');
        },
    });
}
