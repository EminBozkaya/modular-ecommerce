import type { AuthResponse, AuthUser, ChangePasswordRequest, LoginRequest, RegisterRequest, UpdateProfileRequest, UpdateProfileResponse } from '../types/auth';

// Simulated user store for mock mode
const mockUsers: (AuthUser & { password: string })[] = [
    { id: '1', email: 'admin@test.com', password: 'Admin123!', fullName: 'Admin User', firstName: 'Admin', lastName: 'User', phoneNumber: null, role: 'Admin' },
    { id: '2', email: 'user@test.com', password: 'User123!', fullName: 'Test Customer', firstName: 'Test', lastName: 'Customer', phoneNumber: null, role: 'Customer' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockLogin(req: LoginRequest): Promise<AuthResponse> {
    await delay(400);
    const user = mockUsers.find(u => u.email === req.email && u.password === req.password);

    if (!user) {
        throw {
            response: {
                status: 401,
                data: { detail: 'Invalid email or password' }
            }
        };
    }

    const { password, ...authUser } = user;
    sessionStorage.setItem('mock_user', JSON.stringify(authUser));
    return { user: authUser };
}

export async function mockRegister(req: RegisterRequest): Promise<AuthResponse> {
    await delay(400);
    const existingUser = mockUsers.find(u => u.email === req.email);

    if (existingUser) {
        throw {
            response: {
                status: 400,
                data: { errors: { Email: ['Email is already in use'] } }
            }
        };
    }

    const newUser = {
        id: String(mockUsers.length + 1),
        email: req.email,
        password: req.password,
        firstName: req.firstName,
        lastName: req.lastName,
        fullName: `${req.firstName} ${req.lastName}`,
        phoneNumber: null,
        role: 'Customer' as const
    };

    mockUsers.push(newUser);
    const { password, ...authUser } = newUser;
    sessionStorage.setItem('mock_user', JSON.stringify(authUser));
    return { user: authUser };
}

export async function mockLogout(): Promise<void> {
    await delay(400);
    sessionStorage.removeItem('mock_user');
}

export async function mockGetMe(): Promise<AuthUser> {
    await delay(400);
    const stored = sessionStorage.getItem('mock_user');
    if (!stored) {
        throw { response: { status: 401 } };
    }
    return JSON.parse(stored);
}

export async function mockUpdateProfile(req: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    await delay(400);
    const stored = sessionStorage.getItem('mock_user');
    if (!stored) throw { response: { status: 401 } };
    const user: AuthUser = JSON.parse(stored);
    const updated: AuthUser = {
        ...user,
        firstName: req.firstName,
        lastName: req.lastName,
        fullName: `${req.firstName} ${req.lastName}`,
        phoneNumber: req.phoneNumber ?? null,
    };
    sessionStorage.setItem('mock_user', JSON.stringify(updated));
    return { fullName: updated.fullName, firstName: updated.firstName, lastName: updated.lastName, phoneNumber: updated.phoneNumber };
}

export async function mockChangePassword(req: ChangePasswordRequest): Promise<void> {
    await delay(400);
    const stored = sessionStorage.getItem('mock_user');
    if (!stored) throw { response: { status: 401 } };
    const user = mockUsers.find(u => u.id === (JSON.parse(stored) as AuthUser).id);
    if (!user || user.password !== req.currentPassword) {
        throw { response: { status: 400, data: { error: 'Current password is incorrect.' } } };
    }
    user.password = req.newPassword;
}
