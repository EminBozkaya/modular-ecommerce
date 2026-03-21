export interface WishlistItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    currency: string;
    imageUrl: string | null;
    categoryName: string;
    stockQuantity: number;
    isActive: boolean;
    unitName: string;
    unitCode: string | null;
    addedAt: string;
}
