export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: 'Customer' | 'Admin';
    isEmailConfirmed: boolean;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: string;
}
