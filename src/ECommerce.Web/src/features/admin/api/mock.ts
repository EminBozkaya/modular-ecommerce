import type { DashboardSummary, DashboardPeriod, RevenueDataPoint } from '../types/dashboard';
import type { UpdateOrderStatusRequest } from '../types/adminOrder';
import type { AdminUser } from '../types/adminUser';
import type { Order, OrderStatus } from '../../ordering/types/order';
import type { Product } from '../../catalog/types/product';
import type { PaginatedResult } from '../../../types/api';
import type { AdminAddress, UpdateAddressData } from '../types/adminAddress';
import type { AddressFormData } from '@/lib/validations/admin.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Dashboard Mock Data ──

const summaryByPeriod: Record<DashboardPeriod, DashboardSummary> = {
    daily: {
        totalOrders: 12,
        totalRevenue: 156.00,
        revenueCurrency: 'USD',
        totalCustomers: 8,
        lowStockCount: 4,
    },
    weekly: {
        totalOrders: 47,
        totalRevenue: 612.50,
        revenueCurrency: 'USD',
        totalCustomers: 29,
        lowStockCount: 4,
    },
    monthly: {
        totalOrders: 156,
        totalRevenue: 2_914.00,
        revenueCurrency: 'USD',
        totalCustomers: 84,
        lowStockCount: 4,
    },
    yearly: {
        totalOrders: 1_842,
        totalRevenue: 31_520.00,
        revenueCurrency: 'USD',
        totalCustomers: 412,
        lowStockCount: 4,
    },
};

export async function mockGetDashboardSummary(period: DashboardPeriod): Promise<DashboardSummary> {
    await delay(400);
    return summaryByPeriod[period];
}

function generateRevenueData(): RevenueDataPoint[] {
    const data: RevenueDataPoint[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toISOString().split('T')[0],
            revenue: Math.round((50 + Math.random() * 120) * 100) / 100,
        });
    }
    return data;
}

const cachedRevenueData = generateRevenueData();

export async function mockGetRevenueData(): Promise<RevenueDataPoint[]> {
    await delay(400);
    return cachedRevenueData;
}

// ── Orders Mock Data ──

const mockAdminOrders: Order[] = [
    {
        id: 'ord-a01',
        status: 'Pending',
        items: [
            { productId: 'p1', productName: 'Ürün-A1', unitPrice: 12.99, currency: 'USD', quantity: 2, lineTotal: 25.98 },
            { productId: 'p3', productName: 'Ürün-A3', unitPrice: 24.99, currency: 'USD', quantity: 1, lineTotal: 24.99 },
        ],
        totalAmount: 50.97,
        currency: 'USD',
        createdAt: '2026-03-09T09:15:00Z',
        shippingAddress: { fullName: 'John Smith', addressLine1: '123 Main Street, Apt 4', city: 'New York', postalCode: '10001', country: 'United States' },
        isDeleted: false,
    },
    {
        id: 'ord-a02',
        status: 'Paid',
        items: [
            { productId: 'p2', productName: 'Ürün-A2', unitPrice: 18.50, currency: 'USD', quantity: 3, lineTotal: 55.50 },
        ],
        totalAmount: 55.50,
        currency: 'USD',
        createdAt: '2026-03-08T14:30:00Z',
        shippingAddress: { fullName: 'Marie Dupont', addressLine1: '15 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'France' },
        isDeleted: false,
    },
    {
        id: 'ord-a03',
        status: 'Shipped',
        items: [
            { productId: 'p6', productName: 'Ürün-C1', unitPrice: 22.50, currency: 'USD', quantity: 2, lineTotal: 45.00 },
            { productId: 'p7', productName: 'Ürün-C2', unitPrice: 14.99, currency: 'USD', quantity: 1, lineTotal: 14.99 },
        ],
        totalAmount: 59.99,
        currency: 'USD',
        createdAt: '2026-03-07T11:00:00Z',
        shippingAddress: { fullName: 'Hans Mueller', addressLine1: 'Berliner Str. 42', city: 'Berlin', postalCode: '10115', country: 'Germany' },
        isDeleted: false,
    },
    {
        id: 'ord-a04',
        status: 'Delivered',
        items: [
            { productId: 'p5', productName: 'Ürün-B2', unitPrice: 15.00, currency: 'USD', quantity: 1, lineTotal: 15.00 },
        ],
        totalAmount: 15.00,
        currency: 'USD',
        createdAt: '2026-03-05T16:20:00Z',
        shippingAddress: { fullName: 'Carlos Garcia', addressLine1: 'Calle Gran Vía 28', city: 'Madrid', postalCode: '28013', country: 'Spain' },
        isDeleted: false,
    },
    {
        id: 'ord-a05',
        status: 'Cancelled',
        items: [
            { productId: 'p10', productName: 'Ürün-D2', unitPrice: 39.99, currency: 'USD', quantity: 2, lineTotal: 79.98 },
        ],
        totalAmount: 79.98,
        currency: 'USD',
        createdAt: '2026-03-04T08:45:00Z',
        shippingAddress: { fullName: 'Emma Brown', addressLine1: '22 Baker Street', city: 'London', postalCode: 'W1U 3BW', country: 'United Kingdom' },
        isDeleted: false,
    },
    {
        id: 'ord-a06',
        status: 'Paid',
        items: [
            { productId: 'p4', productName: 'Ürün-B1', unitPrice: 9.99, currency: 'USD', quantity: 4, lineTotal: 39.96 },
            { productId: 'p9', productName: 'Ürün-D1', unitPrice: 29.99, currency: 'USD', quantity: 1, lineTotal: 29.99 },
        ],
        totalAmount: 69.95,
        currency: 'USD',
        createdAt: '2026-03-03T13:10:00Z',
        shippingAddress: { fullName: 'Yuki Tanaka', addressLine1: '1-2-3 Shibuya', city: 'Tokyo', postalCode: '150-0002', country: 'Japan' },
        isDeleted: false,
    },
    {
        id: 'ord-a07',
        status: 'Delivered',
        items: [
            { productId: 'p1', productName: 'Ürün-A1', unitPrice: 12.99, currency: 'USD', quantity: 1, lineTotal: 12.99 },
        ],
        totalAmount: 12.99,
        currency: 'USD',
        createdAt: '2026-03-02T10:30:00Z',
        shippingAddress: { fullName: 'Liam Johnson', addressLine1: '88 Queen Street', city: 'Toronto', postalCode: 'M5H 2M5', country: 'Canada' },
        isDeleted: false,
    },
    {
        id: 'ord-a08',
        status: 'Shipped',
        items: [
            { productId: 'p11', productName: 'Ürün-E1', unitPrice: 16.99, currency: 'USD', quantity: 2, lineTotal: 33.98 },
        ],
        totalAmount: 33.98,
        currency: 'USD',
        createdAt: '2026-03-01T15:00:00Z',
        shippingAddress: { fullName: 'Anna Petrova', addressLine1: 'Nevsky Prospekt 50', city: 'St. Petersburg', postalCode: '191025', country: 'Russia' },
        isDeleted: false,
    },
    {
        id: 'ord-a09',
        status: 'Pending',
        items: [
            { productId: 'p3', productName: 'Ürün-A3', unitPrice: 24.99, currency: 'USD', quantity: 3, lineTotal: 74.97 },
        ],
        totalAmount: 74.97,
        currency: 'USD',
        createdAt: '2026-02-28T09:00:00Z',
        shippingAddress: { fullName: 'Omar Al-Farsi', addressLine1: 'Al Olaya District', city: 'Riyadh', postalCode: '12211', country: 'Saudi Arabia' },
        isDeleted: false,
    },
    {
        id: 'ord-a10',
        status: 'Delivered',
        items: [
            { productId: 'p6', productName: 'Ürün-C1', unitPrice: 22.50, currency: 'USD', quantity: 1, lineTotal: 22.50 },
            { productId: 'p2', productName: 'Ürün-A2', unitPrice: 18.50, currency: 'USD', quantity: 2, lineTotal: 37.00 },
        ],
        totalAmount: 59.50,
        currency: 'USD',
        createdAt: '2026-02-25T12:45:00Z',
        shippingAddress: { fullName: 'Sofia Rossi', addressLine1: 'Via Roma 15', city: 'Rome', postalCode: '00184', country: 'Italy' },
        isDeleted: false,
    },
    {
        id: 'ord-a11',
        status: 'Paid',
        items: [
            { productId: 'p7', productName: 'Ürün-C2', unitPrice: 14.99, currency: 'USD', quantity: 5, lineTotal: 74.95 },
        ],
        totalAmount: 74.95,
        currency: 'USD',
        createdAt: '2026-02-22T17:20:00Z',
        shippingAddress: { fullName: 'Chen Wei', addressLine1: '88 Nanjing Road', city: 'Shanghai', postalCode: '200001', country: 'China' },
        isDeleted: false,
    },
    {
        id: 'ord-a12',
        status: 'Delivered',
        items: [
            { productId: 'p13', productName: 'Ürün-E3', unitPrice: 34.99, currency: 'USD', quantity: 2, lineTotal: 69.98 },
        ],
        totalAmount: 69.98,
        currency: 'USD',
        createdAt: '2026-02-20T08:00:00Z',
        shippingAddress: { fullName: 'Lucas Silva', addressLine1: 'Av. Paulista 1000', city: 'São Paulo', postalCode: '01310-100', country: 'Brazil' },
        isDeleted: false,
    },
];

export async function mockGetRecentOrders(): Promise<Order[]> {
    await delay(400);
    return mockAdminOrders.slice(0, 10).map(o => ({ ...o }));
}

export async function mockGetLowStockProducts(): Promise<Product[]> {
    await delay(400);
    return [
        { id: 'p8', name: 'Ürün-C3', description: 'Kategori-C grubuna ait üçüncü ürün.', price: 19.50, priceAmount: 19.50, currency: 'USD', priceCurrency: 'USD', stockQuantity: 0, categoryId: '3', categoryName: 'Kategori-C', unitId: 'u1', unitName: 'Kg', imageUrl: null, isActive: true, createdAt: '2025-12-01T10:00:00Z' },
        { id: 'p12', name: 'Ürün-E2', description: 'Kategori-E grubuna ait ikinci ürün.', price: 11.50, priceAmount: 11.50, currency: 'USD', priceCurrency: 'USD', stockQuantity: 3, categoryId: '5', categoryName: 'Kategori-E', unitId: 'u3', unitName: 'Adet', imageUrl: null, isActive: true, createdAt: '2025-12-05T10:00:00Z' },
        { id: 'p5', name: 'Ürün-B2', description: 'Kategori-B grubuna ait ikinci ürün.', price: 15.00, priceAmount: 15.00, currency: 'USD', priceCurrency: 'USD', stockQuantity: 8, categoryId: '2', categoryName: 'Kategori-B', unitId: 'u3', unitName: 'Adet', imageUrl: null, isActive: true, createdAt: '2025-12-10T10:00:00Z' },
        { id: 'p13', name: 'Ürün-E3', description: 'Kategori-E grubuna ait üçüncü ürün.', price: 34.99, priceAmount: 34.99, currency: 'USD', priceCurrency: 'USD', stockQuantity: 15, categoryId: '5', categoryName: 'Kategori-E', unitId: 'u5', unitName: 'Paket', imageUrl: null, isActive: true, createdAt: '2025-12-15T10:00:00Z' },
    ];
}

export async function mockGetAllOrders(params: { page?: number; pageSize?: number; status?: OrderStatus }): Promise<PaginatedResult<Order>> {
    await delay(400);
    let filtered = [...mockAdminOrders];
    if (params.status) {
        filtered = filtered.filter(o => o.status === params.status);
    }
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    return {
        items: filtered.slice(start, start + pageSize).map(o => ({ ...o })),
        totalCount: filtered.length,
        page,
        pageSize,
    };
}

export async function mockUpdateOrderStatus(req: UpdateOrderStatusRequest): Promise<Order> {
    await delay(400);
    const order = mockAdminOrders.find(o => o.id === req.orderId);
    if (!order) {
        throw { response: { status: 404, data: { message: 'Sipariş bulunamadı' } } };
    }
    order.status = req.newStatus;
    return { ...order };
}

export async function mockDeleteOrder(id: string): Promise<void> {
    await delay(400);
    const order = mockAdminOrders.find(o => o.id === id);
    if (!order) throw { response: { status: 404, data: { message: 'Sipariş bulunamadı' } } };
    order.isDeleted = true;
}

export async function mockRestoreOrder(id: string): Promise<void> {
    await delay(400);
    const order = mockAdminOrders.find(o => o.id === id);
    if (!order) throw { response: { status: 404, data: { message: 'Sipariş bulunamadı' } } };
    order.isDeleted = false;
}

// ── Users Mock Data ──

const mockUsers: AdminUser[] = [
    { id: 'u1', fullName: 'John Smith', email: 'john.smith@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2025-10-15T08:30:00Z' },
    { id: 'u2', fullName: 'Marie Dupont', email: 'marie.dupont@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2025-11-02T14:00:00Z' },
    { id: 'u3', fullName: 'Hans Mueller', email: 'hans.mueller@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2025-11-20T10:15:00Z' },
    { id: 'u4', fullName: 'Carlos Garcia', email: 'carlos.garcia@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2025-12-01T09:00:00Z' },
    { id: 'u5', fullName: 'Emma Brown', email: 'emma.brown@example.com', role: 'Customer', isEmailConfirmed: false, isDeleted: false, isActive: true, createdAt: '2025-12-10T16:45:00Z' },
    { id: 'u6', fullName: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2026-01-05T11:30:00Z' },
    { id: 'u7', fullName: 'Liam Johnson', email: 'liam.johnson@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2026-01-20T13:00:00Z' },
    { id: 'u8', fullName: 'Anna Petrova', email: 'anna.petrova@example.com', role: 'Customer', isEmailConfirmed: false, isDeleted: false, isActive: true, createdAt: '2026-02-08T07:45:00Z' },
    { id: 'u9', fullName: 'Omar Al-Farsi', email: 'omar.alfarsi@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2026-02-15T10:00:00Z' },
    { id: 'u10', fullName: 'Sofia Rossi', email: 'sofia.rossi@example.com', role: 'Customer', isEmailConfirmed: true, isDeleted: false, isActive: true, createdAt: '2026-03-01T15:30:00Z' },
];

export async function mockGetUsers(): Promise<AdminUser[]> {
    await delay(400);
    return mockUsers.map(u => ({ ...u }));
}

export interface CreateUserData {
    fullName: string;
    email: string;
    role: 'Customer' | 'Admin';
    isActive: boolean;
}

export interface UpdateUserData {
    id: string;
    fullName: string;
    email: string;
    role: 'Customer' | 'Admin';
    isActive: boolean;
}

let userIdCounter = 11;

export async function mockCreateUser(data: CreateUserData): Promise<string> {
    await delay(400);
    const existing = mockUsers.find(u => u.email === data.email && !u.isDeleted);
    if (existing) throw { response: { status: 400, data: { message: 'Bu e-posta adresi zaten kayıtlı.' } } };
    const id = `u${userIdCounter++}`;
    mockUsers.push({
        id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        isEmailConfirmed: false,
        isDeleted: false,
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
    });
    return id;
}

export async function mockUpdateUser(data: UpdateUserData): Promise<void> {
    await delay(400);
    const user = mockUsers.find(u => u.id === data.id);
    if (!user) throw { response: { status: 404, data: { message: 'Kullanıcı bulunamadı' } } };
    user.fullName = data.fullName;
    user.email = data.email;
    user.role = data.role;
    user.isActive = data.isActive;
}

export async function mockDeleteUser(id: string): Promise<void> {
    await delay(400);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw { response: { status: 404, data: { message: 'Kullanıcı bulunamadı' } } };
    user.isDeleted = true;
}

export async function mockRestoreUser(id: string): Promise<void> {
    await delay(400);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw { response: { status: 404, data: { message: 'Kullanıcı bulunamadı' } } };
    user.isDeleted = false;
}

// ── Addresses Mock Data ──

const mockAddresses: AdminAddress[] = [
    {
        id: 'addr-01',
        userId: 'u1',
        userFullName: 'John Smith',
        title: 'Ev Adresi',
        fullName: 'John Smith',
        addressLine1: 'Atatürk Cad. No:123',
        addressLine2: 'Daire: 4',
        city: 'İstanbul',
        postalCode: '34400',
        country: 'Türkiye',
        isDefault: true,
        isActive: true,
        isDeleted: false,
        createdAt: '2026-03-09T09:15:00Z',
    },
    {
        id: 'addr-02',
        userId: 'u2',
        userFullName: 'Marie Dupont',
        title: 'Work Address',
        fullName: 'Marie Dupont',
        addressLine1: '15 Rue de Rivoli',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        isDefault: true,
        isActive: true,
        isDeleted: false,
        createdAt: '2026-03-08T14:30:00Z',
    },
    {
        id: 'addr-03',
        userId: 'u3',
        userFullName: 'Hans Mueller',
        title: 'Zuhause',
        fullName: 'Hans Mueller',
        addressLine1: 'Berliner Str. 42',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Germany',
        isDefault: true,
        isActive: true,
        isDeleted: false,
        createdAt: '2026-03-07T11:00:00Z',
    },
    {
        id: 'addr-04',
        userId: 'u4',
        userFullName: 'Carlos Garcia',
        title: 'Oficina',
        fullName: 'Carlos Garcia',
        addressLine1: 'Calle Gran Vía 28',
        city: 'Madrid',
        postalCode: '28013',
        country: 'Spain',
        isDefault: true,
        isActive: false,
        isDeleted: false,
        createdAt: '2026-03-05T16:20:00Z',
    },
    {
        id: 'addr-05',
        userId: 'u5',
        userFullName: 'Emma Brown',
        title: 'Home',
        fullName: 'Emma Brown',
        addressLine1: '22 Baker Street',
        city: 'London',
        postalCode: 'W1U 3BW',
        country: 'United Kingdom',
        isDefault: true,
        isActive: true,
        isDeleted: true,
        createdAt: '2026-03-04T08:45:00Z',
    },
];

export async function mockGetAddresses(): Promise<AdminAddress[]> {
    await delay(400);
    return mockAddresses.map(a => ({ ...a }));
}

let addressIdCounter = 6;

export async function mockCreateAddress(data: AddressFormData): Promise<string> {
    await delay(400);
    const id = `addr-${addressIdCounter++ < 10 ? '0' : ''}${addressIdCounter-1}`;
    mockAddresses.push({
        id,
        userId: 'u1', // Default to first user for mock
        userFullName: 'John Smith',
        title: data.title,
        fullName: data.fullName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: false,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
    });
    return id;
}

export async function mockUpdateAddress(data: UpdateAddressData): Promise<void> {
    await delay(400);
    const addr = mockAddresses.find(a => a.id === data.id);
    if (!addr) throw { response: { status: 404, data: { message: 'Adres bulunamadı' } } };
    
    addr.title = data.title;
    addr.fullName = data.fullName;
    addr.addressLine1 = data.addressLine1;
    addr.addressLine2 = data.addressLine2;
    addr.city = data.city;
    addr.postalCode = data.postalCode;
    addr.country = data.country;
    addr.isActive = data.isActive;
    addr.updatedAt = new Date().toISOString();
}

export async function mockDeleteAddress(id: string): Promise<void> {
    await delay(400);
    const addr = mockAddresses.find(a => a.id === id);
    if (!addr) throw { response: { status: 404, data: { message: 'Adres bulunamadı' } } };
    addr.isDeleted = true;
}

export async function mockRestoreAddress(id: string): Promise<void> {
    await delay(400);
    const addr = mockAddresses.find(a => a.id === id);
    if (!addr) throw { response: { status: 404, data: { message: 'Adres bulunamadı' } } };
    addr.isDeleted = false;
    addr.isActive = true;
}
