export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    stockQuantity: number;
    categoryId: string;
    categoryName: string;
    imageUrl: string | null;
    isActive: boolean;
}

export interface ProductListParams {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    search?: string;
}
