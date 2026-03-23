import i18next from 'i18next';
import type { AddToBasketRequest, Basket, UpdateBasketItemRequest } from '../types/basket';
import { mockProducts, translateUnitCode } from '../../catalog/api/mock';

let mockBasket: Basket = { basketId: 'mock-basket', items: [], totalAmount: 0, currency: 'USD' };

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const recalculateTotal = () => {
    mockBasket.totalAmount = mockBasket.items.reduce((sum, item) => sum + (item.unitPriceSnapshot * item.quantity), 0);
};

export const mockGetBasket = async (): Promise<Basket> => {
    await delay(300);
    const lang = i18next.language?.split('-')[0] ?? 'tr';
    // Re-translate unitName on every fetch so language changes are reflected
    const items = mockBasket.items.map(item => ({
        ...item,
        unitName: translateUnitCode(item.unitCode, lang),
    }));
    return { ...mockBasket, items };
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
        const lang = i18next.language?.split('-')[0] ?? 'tr';
        mockBasket.items.push({
            productId: product.id,
            productName: product.name,
            unitPriceSnapshot: product.price,
            currency: product.currency,
            quantity: req.quantity,
            lineTotal: product.price * req.quantity,
            imageUrl: product.imageUrl,
            stockQuantity: product.stockQuantity,
            unitCode: product.unitCode ?? undefined,
            unitName: translateUnitCode(product.unitCode, lang),
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

export const mockUpdateBasketItem = async (req: UpdateBasketItemRequest): Promise<Basket> => {
    await delay(300);

    if (req.quantity <= 0) {
        mockBasket.items = mockBasket.items.filter(i => i.productId !== req.productId);
    } else {
        const index = mockBasket.items.findIndex(i => i.productId === req.productId);
        if (index >= 0) {
            mockBasket.items[index].quantity = req.quantity;
        }
    }

    recalculateTotal();
    return { ...mockBasket };
};

export const mockClearBasket = (): void => {
    mockBasket = { basketId: 'mock-basket', items: [], totalAmount: 0, currency: 'USD' };
};
