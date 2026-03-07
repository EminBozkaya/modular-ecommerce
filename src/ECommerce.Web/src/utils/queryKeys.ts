export const queryKeys = {
    catalog: {
        products: {
            all: ['catalog', 'products', 'all'] as const,
            list: (params: any) => ['catalog', 'products', 'list', params] as const,
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
    },
} as const;
