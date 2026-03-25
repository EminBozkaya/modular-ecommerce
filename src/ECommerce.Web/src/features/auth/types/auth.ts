export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    role: 'Customer' | 'Admin';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: AuthUser;
    // No token fields — token lives in httpOnly cookie set by backend
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}

export interface UpdateProfileResponse {
    fullName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
