export const queryKeys = {
    catalog: {
        products: {
            all: ['catalog', 'products', 'all'] as const,
            list: (params: Record<string, unknown>) => ['catalog', 'products', 'list', params] as const,
            detail: (id: string) => ['catalog', 'products', 'detail', id] as const,
        },
        categories: {
            all: ['catalog', 'categories', 'all'] as const,
        },
    },
    basket: {
        current: ['basket', 'current'] as const,
    },
    orders: {
        all: ['orders', 'all'] as const,
        detail: (id: string) => ['orders', 'detail', id] as const,
    },
    auth: {
        me: ['auth', 'me'] as const,
        addresses: ['auth', 'addresses'] as const,
    },
    wishlist: {
        items: ['wishlist', 'items'] as const,
        productIds: ['wishlist', 'productIds'] as const,
    },
    payment: {
        providers: ['payment', 'providers'] as const,
        returnStatus: (orderId: string) => ['payment', 'returnStatus', orderId] as const,
    },
    config: {
        languages: ['config', 'languages'] as const,
    },
    admin: {
        dashboard: {
            summary: (period: string) => ['admin', 'dashboard', 'summary', period] as const,
            revenueData: ['admin', 'dashboard', 'revenueData'] as const,
            recentOrders: ['admin', 'dashboard', 'recentOrders'] as const,
            lowStock: ['admin', 'dashboard', 'lowStock'] as const,
        },
        orders: {
            all: ['admin', 'orders'] as const,
            list: (params: object) => ['admin', 'orders', 'list', params] as const,
        },
        users: {
            all: ['admin', 'users'] as const,
        },
        settings: {
            store: ['admin', 'settings', 'store'] as const,
            app: (category: string) => ['admin', 'settings', 'app', category] as const,
        },
    },
    store: {
        settings: ['store', 'settings'] as const,
    },
} as const;
