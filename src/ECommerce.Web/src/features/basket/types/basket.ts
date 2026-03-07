export interface BasketItem {
    productId: string;
    productName: string;
    unitPriceSnapshot: number;
    currency: string;
    quantity: number;
    imageUrl: string | null;
}

export interface Basket {
    items: BasketItem[];
    totalAmount: number;
    currency: string;
}

export interface AddToBasketRequest {
    productId: string;
    quantity: number;
}

export interface RemoveFromBasketRequest {
    productId: string;
}
