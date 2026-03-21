import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

// Simulated user store for mock mode
const mockUsers: (AuthUser & { password: string })[] = [
    { id: '1', email: 'admin@test.com', password: 'Admin123!', fullName: 'Admin User', role: 'Admin' },
    { id: '2', email: 'user@test.com', password: 'User123!', fullName: 'Test Customer', role: 'Customer' },
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
        fullName: `${req.firstName} ${req.lastName}`,
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
