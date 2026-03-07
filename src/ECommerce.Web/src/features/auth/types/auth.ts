export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
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
