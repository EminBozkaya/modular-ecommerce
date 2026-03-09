import type { DashboardSummary, DashboardPeriod, RevenueDataPoint } from '../types/dashboard';
import type { UpdateOrderStatusRequest } from '../types/adminOrder';
import type { AdminUser } from '../types/adminUser';
import type { Order, OrderStatus } from '../../ordering/types/order';
import type { Product } from '../../catalog/types/product';
import type { PaginatedResult } from '../../../types/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Dashboard Mock Data ──

const summaryByPeriod: Record<DashboardPeriod, DashboardSummary> = {
    daily: {
        totalOrders: 12,
        totalRevenue: 4_850.00,
        revenueCurrency: 'TRY',
        totalCustomers: 8,
        lowStockCount: 4,
    },
    weekly: {
        totalOrders: 47,
        totalRevenue: 18_320.75,
        revenueCurrency: 'TRY',
        totalCustomers: 29,
        lowStockCount: 4,
    },
    monthly: {
        totalOrders: 156,
        totalRevenue: 87_420.50,
        revenueCurrency: 'TRY',
        totalCustomers: 84,
        lowStockCount: 4,
    },
    yearly: {
        totalOrders: 1_842,
        totalRevenue: 945_680.00,
        revenueCurrency: 'TRY',
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
            revenue: Math.round((1500 + Math.random() * 3500) * 100) / 100,
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
            { productId: 'p1', productName: 'Karışık Kavrulmuş Kuruyemiş', unitPrice: 159.99, currency: 'TRY', quantity: 2, lineTotal: 319.98 },
            { productId: 'p3', productName: 'Premium Antep Fıstığı', unitPrice: 249.00, currency: 'TRY', quantity: 1, lineTotal: 249.00 },
        ],
        totalAmount: 568.98,
        currency: 'TRY',
        createdAt: '2026-03-09T09:15:00Z',
        shippingAddress: { fullName: 'Mehmet Demir', addressLine1: 'Bağdat Cad. No:88', city: 'İstanbul', postalCode: '34744', country: 'Türkiye' },
    },
    {
        id: 'ord-a02',
        status: 'Paid',
        items: [
            { productId: 'p2', productName: 'Kuru Kayısı', unitPrice: 89.50, currency: 'TRY', quantity: 3, lineTotal: 268.50 },
        ],
        totalAmount: 268.50,
        currency: 'TRY',
        createdAt: '2026-03-08T14:30:00Z',
        shippingAddress: { fullName: 'Ayşe Kaya', addressLine1: 'Atatürk Bulvarı No:12', city: 'Ankara', postalCode: '06100', country: 'Türkiye' },
    },
    {
        id: 'ord-a03',
        status: 'Shipped',
        items: [
            { productId: 'p6', productName: 'Kavrulmuş Badem', unitPrice: 185.50, currency: 'TRY', quantity: 2, lineTotal: 371.00 },
            { productId: 'p7', productName: 'Trail Mix - Enerji Karışımı', unitPrice: 125.00, currency: 'TRY', quantity: 1, lineTotal: 125.00 },
        ],
        totalAmount: 496.00,
        currency: 'TRY',
        createdAt: '2026-03-07T11:00:00Z',
        shippingAddress: { fullName: 'Fatma Yıldız', addressLine1: 'Kültür Mah. 45. Sk. No:7', city: 'İzmir', postalCode: '35220', country: 'Türkiye' },
    },
    {
        id: 'ord-a04',
        status: 'Delivered',
        items: [
            { productId: 'p5', productName: 'Organik Bal', unitPrice: 220.00, currency: 'TRY', quantity: 1, lineTotal: 220.00 },
        ],
        totalAmount: 220.00,
        currency: 'TRY',
        createdAt: '2026-03-05T16:20:00Z',
        shippingAddress: { fullName: 'Ali Yılmaz', addressLine1: 'İstiklal Cad. No:100', city: 'İstanbul', postalCode: '34433', country: 'Türkiye' },
    },
    {
        id: 'ord-a05',
        status: 'Cancelled',
        items: [
            { productId: 'p10', productName: 'Kaju Fıstığı', unitPrice: 299.00, currency: 'TRY', quantity: 2, lineTotal: 598.00 },
        ],
        totalAmount: 598.00,
        currency: 'TRY',
        createdAt: '2026-03-04T08:45:00Z',
        shippingAddress: { fullName: 'Hasan Çelik', addressLine1: 'Cumhuriyet Mah. 10. Sk. No:3', city: 'Bursa', postalCode: '16010', country: 'Türkiye' },
    },
    {
        id: 'ord-a06',
        status: 'Paid',
        items: [
            { productId: 'p4', productName: 'Kuru İncir', unitPrice: 79.99, currency: 'TRY', quantity: 4, lineTotal: 319.96 },
            { productId: 'p9', productName: 'Kabuklu Ceviz', unitPrice: 139.00, currency: 'TRY', quantity: 1, lineTotal: 139.00 },
        ],
        totalAmount: 458.96,
        currency: 'TRY',
        createdAt: '2026-03-03T13:10:00Z',
        shippingAddress: { fullName: 'Zeynep Arslan', addressLine1: 'Güneş Sk. No:22', city: 'Antalya', postalCode: '07100', country: 'Türkiye' },
    },
    {
        id: 'ord-a07',
        status: 'Delivered',
        items: [
            { productId: 'p1', productName: 'Karışık Kavrulmuş Kuruyemiş', unitPrice: 159.99, currency: 'TRY', quantity: 1, lineTotal: 159.99 },
        ],
        totalAmount: 159.99,
        currency: 'TRY',
        createdAt: '2026-03-02T10:30:00Z',
        shippingAddress: { fullName: 'Emre Şahin', addressLine1: 'Vatan Cad. No:55', city: 'Konya', postalCode: '42040', country: 'Türkiye' },
    },
    {
        id: 'ord-a08',
        status: 'Shipped',
        items: [
            { productId: 'p8', productName: 'Çekirdekli Hurma', unitPrice: 169.50, currency: 'TRY', quantity: 2, lineTotal: 339.00 },
        ],
        totalAmount: 339.00,
        currency: 'TRY',
        createdAt: '2026-03-01T15:00:00Z',
        shippingAddress: { fullName: 'Selin Öztürk', addressLine1: 'Çiçek Sk. No:8', city: 'Eskişehir', postalCode: '26010', country: 'Türkiye' },
    },
    {
        id: 'ord-a09',
        status: 'Pending',
        items: [
            { productId: 'p3', productName: 'Premium Antep Fıstığı', unitPrice: 249.00, currency: 'TRY', quantity: 3, lineTotal: 747.00 },
        ],
        totalAmount: 747.00,
        currency: 'TRY',
        createdAt: '2026-02-28T09:00:00Z',
        shippingAddress: { fullName: 'Burak Kılıç', addressLine1: 'Mevlana Cad. No:30', city: 'Gaziantep', postalCode: '27010', country: 'Türkiye' },
    },
    {
        id: 'ord-a10',
        status: 'Delivered',
        items: [
            { productId: 'p6', productName: 'Kavrulmuş Badem', unitPrice: 185.50, currency: 'TRY', quantity: 1, lineTotal: 185.50 },
            { productId: 'p2', productName: 'Kuru Kayısı', unitPrice: 89.50, currency: 'TRY', quantity: 2, lineTotal: 179.00 },
        ],
        totalAmount: 364.50,
        currency: 'TRY',
        createdAt: '2026-02-25T12:45:00Z',
        shippingAddress: { fullName: 'Derya Aydın', addressLine1: 'Sahil Yolu No:15', city: 'Trabzon', postalCode: '61030', country: 'Türkiye' },
    },
    {
        id: 'ord-a11',
        status: 'Paid',
        items: [
            { productId: 'p7', productName: 'Trail Mix - Enerji Karışımı', unitPrice: 125.00, currency: 'TRY', quantity: 5, lineTotal: 625.00 },
        ],
        totalAmount: 625.00,
        currency: 'TRY',
        createdAt: '2026-02-22T17:20:00Z',
        shippingAddress: { fullName: 'Gizem Polat', addressLine1: 'Yıldız Mah. 3. Sk. No:11', city: 'Kayseri', postalCode: '38010', country: 'Türkiye' },
    },
    {
        id: 'ord-a12',
        status: 'Delivered',
        items: [
            { productId: 'p5', productName: 'Organik Bal', unitPrice: 220.00, currency: 'TRY', quantity: 2, lineTotal: 440.00 },
        ],
        totalAmount: 440.00,
        currency: 'TRY',
        createdAt: '2026-02-20T08:00:00Z',
        shippingAddress: { fullName: 'Can Aksoy', addressLine1: 'Demokrasi Blv. No:72', city: 'Mersin', postalCode: '33010', country: 'Türkiye' },
    },
];

export async function mockGetRecentOrders(): Promise<Order[]> {
    await delay(400);
    return mockAdminOrders.slice(0, 10).map(o => ({ ...o }));
}

export async function mockGetLowStockProducts(): Promise<Product[]> {
    await delay(400);
    return [
        { id: 'p8', name: 'Çekirdekli Hurma', description: 'Taze ve yumuşak Medjool hurma.', price: 169.50, priceAmount: 169.50, currency: 'TRY', priceCurrency: 'TRY', stockQuantity: 0, categoryId: '4', categoryName: 'Kuru Meyve', unitId: 'u1', unitName: 'Kg', imageUrl: null, isActive: true, createdAt: '2025-12-01T10:00:00Z' },
        { id: 'p11', name: 'Antep Fıstığı İçi', description: 'Kabuksuz yeşil Antep fıstığı.', price: 349.00, priceAmount: 349.00, currency: 'TRY', priceCurrency: 'TRY', stockQuantity: 2, categoryId: '1', categoryName: 'Kuruyemiş', unitId: 'u1', unitName: 'Kg', imageUrl: null, isActive: true, createdAt: '2025-12-05T10:00:00Z' },
        { id: 'p12', name: 'Kurutulmuş Çilek', description: 'Doğal kurutulmuş çilek.', price: 129.90, priceAmount: 129.90, currency: 'TRY', priceCurrency: 'TRY', stockQuantity: 3, categoryId: '4', categoryName: 'Kuru Meyve', unitId: 'u1', unitName: 'Kg', imageUrl: null, isActive: true, createdAt: '2025-12-10T10:00:00Z' },
        { id: 'p13', name: 'Yer Fıstığı', description: 'Kavrulmuş tuzlu yer fıstığı.', price: 69.90, priceAmount: 69.90, currency: 'TRY', priceCurrency: 'TRY', stockQuantity: 5, categoryId: '1', categoryName: 'Kuruyemiş', unitId: 'u1', unitName: 'Kg', imageUrl: null, isActive: true, createdAt: '2025-12-15T10:00:00Z' },
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

// ── Users Mock Data ──

const mockUsers: AdminUser[] = [
    { id: 'u1', fullName: 'Mehmet Demir', email: 'mehmet.demir@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2025-10-15T08:30:00Z' },
    { id: 'u2', fullName: 'Ayşe Kaya', email: 'ayse.kaya@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2025-11-02T14:00:00Z' },
    { id: 'u3', fullName: 'Fatma Yıldız', email: 'fatma.yildiz@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2025-11-20T10:15:00Z' },
    { id: 'u4', fullName: 'Ali Yılmaz', email: 'ali.yilmaz@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2025-12-01T09:00:00Z' },
    { id: 'u5', fullName: 'Hasan Çelik', email: 'hasan.celik@email.com', role: 'Customer', isEmailConfirmed: false, createdAt: '2025-12-10T16:45:00Z' },
    { id: 'u6', fullName: 'Zeynep Arslan', email: 'zeynep.arslan@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2026-01-05T11:30:00Z' },
    { id: 'u7', fullName: 'Emre Şahin', email: 'emre.sahin@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2026-01-20T13:00:00Z' },
    { id: 'u8', fullName: 'Selin Öztürk', email: 'selin.ozturk@email.com', role: 'Customer', isEmailConfirmed: false, createdAt: '2026-02-08T07:45:00Z' },
    { id: 'u9', fullName: 'Burak Kılıç', email: 'burak.kilic@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2026-02-15T10:00:00Z' },
    { id: 'u10', fullName: 'Derya Aydın', email: 'derya.aydin@email.com', role: 'Customer', isEmailConfirmed: true, createdAt: '2026-03-01T15:30:00Z' },
];

export async function mockGetUsers(): Promise<AdminUser[]> {
    await delay(400);
    return mockUsers.map(u => ({ ...u }));
}
