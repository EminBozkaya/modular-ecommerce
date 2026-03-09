export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: 'Customer' | 'Admin';
    isEmailConfirmed: boolean;
    createdAt: string;
}
