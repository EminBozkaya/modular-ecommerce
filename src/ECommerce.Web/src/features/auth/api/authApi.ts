import { apiClient } from '../../../api/client';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
import { mockGetMe, mockLogin, mockLogout, mockRegister } from './mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export async function login(req: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) return mockLogin(req);
    const response = await apiClient.post<AuthResponse>('/api/auth/login', req);
    return response.data;
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) return mockRegister(req);
    const response = await apiClient.post<AuthResponse>('/api/auth/register', req);
    return response.data;
}

export async function logout(): Promise<void> {
    if (USE_MOCK) return mockLogout();
    await apiClient.post('/api/auth/logout');
}

/**
 * RESTORES SESSION ON PAGE LOAD.
 * NOTE TO BACKEND: /api/auth/me is not yet in the backend README. It is a standard session-restoration endpoint.
 * The backend should implement GET /api/auth/me -> returns current user from JWT cookie, or 401 if not authenticated.
 */
export async function getMe(): Promise<AuthUser> {
    if (USE_MOCK) return mockGetMe();
    const response = await apiClient.get<AuthUser>('/api/auth/me');
    return response.data;
}
