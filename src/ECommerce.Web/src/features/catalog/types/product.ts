export interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    parentCategoryId?: string | null;
    parentCategoryName?: string | null;
    isDeleted?: boolean;
    createdAt: string;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    deletedAt?: string | null;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    priceAmount: number;
    currency: string;
    priceCurrency: string;
    stockQuantity: number;
    categoryId: string;
    categoryName: string;
    imageUrl: string | null;
    isActive: boolean;
    isDeleted?: boolean;
    createdAt: string;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    deletedAt?: string | null;
}

export interface ProductListParams {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    search?: string;
    includeInactive?: boolean;
    includeDeleted?: boolean;
}
