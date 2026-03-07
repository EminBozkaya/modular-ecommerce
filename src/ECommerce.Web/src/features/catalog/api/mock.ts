import type { Category, Product } from '../types/product';
import type { PaginatedResult } from '../../../types/api';

export const mockCategories: Category[] = [
    { id: '1', name: 'Kuruyemiş', slug: 'kuruyemis' },
    { id: '2', name: 'Baharat & Şifalı Bitkiler', slug: 'baharat-sifali-bitkiler' },
    { id: '3', name: 'Genel', slug: 'genel' },
    { id: '4', name: 'Kuru Meyve', slug: 'kuru-meyve' },
    { id: '5', name: 'Atıştırmalık & Mix', slug: 'atistirmalik-mix' },
];

export const mockProducts: Product[] = [
    {
        id: 'p1',
        name: 'Karışık Kavrulmuş Kuruyemiş',
        description: 'Badem, kaju ve ceviz içeren premium kavrulmuş kuruyemiş karışımı.',
        price: 159.99,
        currency: 'TRY',
        stockQuantity: 100,
        categoryId: '1',
        categoryName: 'Kuruyemiş',
        imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p2',
        name: 'Kuru Kayısı',
        description: 'Çiftliklerden doğrudan temin edilen güneşte kurutulmuş tatlı kayısılar.',
        price: 89.50,
        currency: 'TRY',
        stockQuantity: 45,
        categoryId: '4',
        categoryName: 'Kuru Meyve',
        imageUrl: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p3',
        name: 'Premium Antep Fıstığı',
        description: 'Hafif tuzlu ve taze kavrulmuş Antep fıstığı.',
        price: 249.00,
        currency: 'TRY',
        stockQuantity: 60,
        categoryId: '1',
        categoryName: 'Kuruyemiş',
        imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p4',
        name: 'Kuru İncir',
        description: 'Ege bölgesinden özenle seçilmiş doğal kuru incirler.',
        price: 79.99,
        currency: 'TRY',
        stockQuantity: 80,
        categoryId: '4',
        categoryName: 'Kuru Meyve',
        imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p5',
        name: 'Organik Bal',
        description: 'Yerel arıcılardan taze organik süzme bal.',
        price: 220.00,
        currency: 'TRY',
        stockQuantity: 8,
        categoryId: '3',
        categoryName: 'Genel',
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p6',
        name: 'Kavrulmuş Badem',
        description: 'Doğal yöntemlerle kavrulmuş taze badem.',
        price: 185.50,
        currency: 'TRY',
        stockQuantity: 60,
        categoryId: '1',
        categoryName: 'Kuruyemiş',
        imageUrl: 'https://images.unsplash.com/photo-1574570173583-a65fc27484be?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p7',
        name: 'Trail Mix - Enerji Karışımı',
        description: 'Fındık, badem, kuru üzüm ve çikolata parçacıkları içeren enerji karışımı.',
        price: 125.00,
        currency: 'TRY',
        stockQuantity: 150,
        categoryId: '5',
        categoryName: 'Atıştırmalık & Mix',
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p8',
        name: 'Çekirdekli Hurma',
        description: 'Taze ve yumuşak Medjool hurma.',
        price: 169.50,
        currency: 'TRY',
        stockQuantity: 0,
        categoryId: '4',
        categoryName: 'Kuru Meyve',
        imageUrl: 'https://images.unsplash.com/photo-1513135065346-a098a63a71ee?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p9',
        name: 'Kabuklu Ceviz',
        description: 'Yerli üretim doğal kabuklu ceviz. Taze ve kaliteli.',
        price: 139.00,
        currency: 'TRY',
        stockQuantity: 35,
        categoryId: '1',
        categoryName: 'Kuruyemiş',
        imageUrl: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=300&h=300&fit=crop',
        isActive: true,
    },
    {
        id: 'p10',
        name: 'Kaju Fıstığı',
        description: 'Premium kalite tuzlu kavrulmuş kaju fıstığı.',
        price: 299.00,
        currency: 'TRY',
        stockQuantity: 25,
        categoryId: '1',
        categoryName: 'Kuruyemiş',
        imageUrl: 'https://images.unsplash.com/photo-1563292769-4405eb6e7add?w=300&h=300&fit=crop',
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
