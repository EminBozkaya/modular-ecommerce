import { apiClient } from '../../../api/client';
import type { AuthResponse, AuthUser, ChangePasswordRequest, LoginRequest, RegisterRequest, UpdateProfileRequest, UpdateProfileResponse } from '../types/auth';
import { mockChangePassword, mockGetMe, mockLogin, mockLogout, mockRegister, mockUpdateProfile } from './mock';

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

export async function getMe(): Promise<AuthUser> {
    if (USE_MOCK) return mockGetMe();
    const response = await apiClient.get<AuthUser>('/api/auth/me');
    return response.data;
}

export async function updateProfile(req: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    if (USE_MOCK) return mockUpdateProfile(req);
    const response = await apiClient.put<UpdateProfileResponse>('/api/auth/profile', req);
    return response.data;
}

export async function changePassword(req: ChangePasswordRequest): Promise<void> {
    if (USE_MOCK) return mockChangePassword(req);
    await apiClient.put('/api/auth/change-password', req);
}

// ─── Social Auth ─────────────────────────────────────────────────────────────

export interface SocialAuthUrlResponse {
    isSuccess: boolean;
    authorizationUrl: string;
    state: string;
}

/**
 * Fetches the OAuth Authorization URL for a given social provider.
 * The frontend redirects the user there so they can authenticate.
 */
export async function getSocialAuthUrl(provider: string): Promise<SocialAuthUrlResponse> {
    const redirectUri = `${window.location.origin}/auth/social/callback`;
    const response = await apiClient.get<SocialAuthUrlResponse>(
        `/api/auth/social/${provider}/url`,
        { params: { redirectUri } }
    );
    return response.data;
}

/**
 * Exchanges the OAuth `code` for a session.
 * Backend handles token exchange + user lookup/create + JWT cookie.
 */
export async function socialLogin(provider: string, code: string): Promise<AuthResponse> {
    const redirectUri = `${window.location.origin}/auth/social/callback`;
    const response = await apiClient.post<AuthResponse>(`/api/auth/social/login/${provider}`, {
        code,
        redirectUri,
    });
    return response.data;
}
