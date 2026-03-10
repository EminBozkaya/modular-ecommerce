export interface BasketItem {
    productId: string;
    productName: string;
    unitPriceSnapshot: number;
    currency: string;
    quantity: number;
    lineTotal: number;
    imageUrl: string | null;
    unitName?: string;
}

export interface Basket {
    basketId: string;
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

export interface UpdateBasketItemRequest {
    productId: string;
    quantity: number;
}
