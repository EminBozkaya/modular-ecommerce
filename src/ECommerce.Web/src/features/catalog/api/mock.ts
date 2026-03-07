import type { Category, Product } from '../types/product';
import type { PaginatedResult } from '../../../types/api';

export const mockCategories: Category[] = [
    { id: '1', name: 'Nuts & Dried Fruits', slug: 'nuts-dried-fruits' },
    { id: '2', name: 'Stationery', slug: 'stationery' },
    { id: '3', name: 'General', slug: 'general' },
];

export const mockProducts: Product[] = [
    {
        id: 'p1',
        name: 'Mixed Roasted Nuts',
        description: 'A mix of premium roasted nuts including almonds, cashews, and walnuts.',
        price: 15.99,
        currency: 'USD',
        stockQuantity: 100,
        categoryId: '1',
        categoryName: 'Nuts & Dried Fruits',
        imageUrl: 'https://via.placeholder.com/300?text=Mixed+Nuts',
        isActive: true,
    },
    {
        id: 'p2',
        name: 'Dried Apricots',
        description: 'Sun-dried sweet apricots sourced directly from farms.',
        price: 8.50,
        currency: 'USD',
        stockQuantity: 45,
        categoryId: '1',
        categoryName: 'Nuts & Dried Fruits',
        imageUrl: 'https://via.placeholder.com/300?text=Dried+Apricots',
        isActive: true,
    },
    {
        id: 'p3',
        name: 'Premium Notebook',
        description: 'A3 dotted notebook with premium 120gsm paper.',
        price: 12.00,
        currency: 'USD',
        stockQuantity: 200,
        categoryId: '2',
        categoryName: 'Stationery',
        imageUrl: null,
        isActive: true,
    },
    {
        id: 'p4',
        name: 'Rollerball Pens (Set of 3)',
        description: 'Smooth black ink rollerball pens for comfortable writing.',
        price: 6.99,
        currency: 'USD',
        stockQuantity: 0,
        categoryId: '2',
        categoryName: 'Stationery',
        imageUrl: 'https://via.placeholder.com/300?text=Pens',
        isActive: true,
    },
    {
        id: 'p5',
        name: 'Organic Honey',
        description: 'Fresh organic honey from local beekeepers.',
        price: 22.00,
        currency: 'USD',
        stockQuantity: 8,
        categoryId: '3',
        categoryName: 'General',
        imageUrl: 'https://via.placeholder.com/300?text=Organic+Honey',
        isActive: true,
    },
    {
        id: 'p6',
        name: 'Roasted Pistachios',
        description: 'Lightly salted and freshly roasted pistachios.',
        price: 18.50,
        currency: 'USD',
        stockQuantity: 60,
        categoryId: '1',
        categoryName: 'Nuts & Dried Fruits',
        imageUrl: 'https://via.placeholder.com/300?text=Pistachios',
        isActive: true,
    },
    {
        id: 'p7',
        name: 'Desk Organizer',
        description: 'Wooden desk organizer with compartments for pens and notes.',
        price: 25.00,
        currency: 'USD',
        stockQuantity: 15,
        categoryId: '2',
        categoryName: 'Stationery',
        imageUrl: 'https://via.placeholder.com/300?text=Desk+Organizer',
        isActive: true,
    },
    {
        id: 'p8',
        name: 'Reusable Water Bottle',
        description: 'Stainless steel 500ml water bottle, keeps drinks cold for 24h.',
        price: 14.50,
        currency: 'USD',
        stockQuantity: 120,
        categoryId: '3',
        categoryName: 'General',
        imageUrl: null,
        isActive: true,
    },
];

export function mockPaginate<T>(items: T[], params: { page?: number; pageSize?: number }): PaginatedResult<T> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedItems = items.slice(startIndex, endIndex);

    return {
        items: pagedItems,
        totalCount: items.length,
        page,
        pageSize,
    };
}
