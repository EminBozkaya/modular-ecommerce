import type { AddToBasketRequest, Basket } from '../types/basket';
import { mockProducts } from '../../catalog/api/mock';

let mockBasket: Basket = { items: [], totalAmount: 0, currency: 'USD' };

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const recalculateTotal = () => {
    mockBasket.totalAmount = mockBasket.items.reduce((sum, item) => sum + (item.unitPriceSnapshot * item.quantity), 0);
};

export const mockGetBasket = async (): Promise<Basket> => {
    await delay(300);
    return { ...mockBasket };
};

export const mockAddToBasket = async (req: AddToBasketRequest): Promise<Basket> => {
    await delay(300);

    const product = mockProducts.find(p => p.id === req.productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const existingItemIndex = mockBasket.items.findIndex(i => i.productId === req.productId);

    if (existingItemIndex >= 0) {
        mockBasket.items[existingItemIndex].quantity += req.quantity;
    } else {
        mockBasket.items.push({
            productId: product.id,
            productName: product.name,
            unitPriceSnapshot: product.price,
            currency: product.currency,
            quantity: req.quantity,
            imageUrl: product.imageUrl,
        });
    }

    recalculateTotal();
    return { ...mockBasket };
};

export const mockRemoveFromBasket = async (productId: string): Promise<Basket> => {
    await delay(300);

    mockBasket.items = mockBasket.items.filter(i => i.productId !== productId);
    recalculateTotal();

    return { ...mockBasket };
};
