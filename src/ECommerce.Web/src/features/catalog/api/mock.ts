import type { Category, Product } from '../types/product';
import type { PaginatedResult } from '../../../types/api';

/** Mirrors DbInitializer.SeedUnitTranslationsAsync — kept in sync manually */
export const UNIT_NAME_TRANSLATIONS: Record<string, Record<string, string>> = {
    kg:    { tr: 'Kilogram',  en: 'Kilogram',  de: 'Kilogramm',    fr: 'Kilogramme', es: 'Kilogramo', ru: 'Килограмм', ar: 'كيلوغرام' },
    g:     { tr: 'Gram',      en: 'Gram',      de: 'Gramm',         fr: 'Gramme',     es: 'Gramo',     ru: 'Грамм',     ar: 'جرام'     },
    adet:  { tr: 'Adet',      en: 'Piece',     de: 'Stück',         fr: 'Pièce',      es: 'Unidad',    ru: 'Штука',     ar: 'قطعة'     },
    lt:    { tr: 'Litre',     en: 'Liter',     de: 'Liter',         fr: 'Litre',      es: 'Litro',     ru: 'Литр',      ar: 'لتر'      },
    paket: { tr: 'Paket',     en: 'Package',   de: 'Paket',         fr: 'Paquet',     es: 'Paquete',   ru: 'Пакет',     ar: 'حزمة'     },
    deste: { tr: 'Deste',     en: 'Bundle',    de: 'Bündel',        fr: 'Botte',      es: 'Manojo',    ru: 'Пучок',     ar: 'بندل'     },
    koli:  { tr: 'Koli',      en: 'Box',       de: 'Karton',        fr: 'Carton',     es: 'Caja',      ru: 'Коробка',   ar: 'صندوق'    },
    kit:   { tr: 'Kit',       en: 'Kit',       de: 'Kit',           fr: 'Kit',        es: 'Kit',       ru: 'Набор',     ar: 'طقم'      },
};

/** Returns the translated unit display name. Falls back: lang → tr → code itself */
export function translateUnitCode(code: string | null | undefined, lang: string): string {
    if (!code) return '';
    const map = UNIT_NAME_TRANSLATIONS[code.toLowerCase()];
    if (!map) return code;
    return map[lang] ?? map['tr'] ?? code;
}

/** Category name translations by category id */
export const CATEGORY_NAME_TRANSLATIONS: Record<string, Record<string, string>> = {
    '1': { tr: 'Kategori-A', en: 'Category-A', de: 'Kategorie-A', fr: 'Catégorie-A', es: 'Categoría-A', ru: 'Категория-A', ar: 'الفئة-أ'  },
    '2': { tr: 'Kategori-B', en: 'Category-B', de: 'Kategorie-B', fr: 'Catégorie-B', es: 'Categoría-B', ru: 'Категория-B', ar: 'الفئة-ب'  },
    '3': { tr: 'Kategori-C', en: 'Category-C', de: 'Kategorie-C', fr: 'Catégorie-C', es: 'Categoría-C', ru: 'Категория-C', ar: 'الفئة-ج'  },
    '4': { tr: 'Kategori-D', en: 'Category-D', de: 'Kategorie-D', fr: 'Catégorie-D', es: 'Categoría-D', ru: 'Категория-D', ar: 'الفئة-د'  },
    '5': { tr: 'Kategori-E', en: 'Category-E', de: 'Kategorie-E', fr: 'Catégorie-E', es: 'Categoría-E', ru: 'Категория-E', ar: 'الفئة-هـ' },
};

/** Product name translations by product id */
export const PRODUCT_NAME_TRANSLATIONS: Record<string, Record<string, string>> = {
    p1:  { tr: 'Ürün-A1', en: 'Product-A1', de: 'Produkt-A1', fr: 'Produit-A1', es: 'Producto-A1', ru: 'Продукт-A1', ar: 'المنتج-أ1'  },
    p2:  { tr: 'Ürün-A2', en: 'Product-A2', de: 'Produkt-A2', fr: 'Produit-A2', es: 'Producto-A2', ru: 'Продукт-A2', ar: 'المنتج-أ2'  },
    p3:  { tr: 'Ürün-A3', en: 'Product-A3', de: 'Produkt-A3', fr: 'Produit-A3', es: 'Producto-A3', ru: 'Продукт-A3', ar: 'المنتج-أ3'  },
    p4:  { tr: 'Ürün-B1', en: 'Product-B1', de: 'Produkt-B1', fr: 'Produit-B1', es: 'Producto-B1', ru: 'Продукт-B1', ar: 'المنتج-ب1'  },
    p5:  { tr: 'Ürün-B2', en: 'Product-B2', de: 'Produkt-B2', fr: 'Produit-B2', es: 'Producto-B2', ru: 'Продукт-B2', ar: 'المنتج-ب2'  },
    p6:  { tr: 'Ürün-C1', en: 'Product-C1', de: 'Produkt-C1', fr: 'Produit-C1', es: 'Producto-C1', ru: 'Продукт-C1', ar: 'المنتج-ج1'  },
    p7:  { tr: 'Ürün-C2', en: 'Product-C2', de: 'Produkt-C2', fr: 'Produit-C2', es: 'Producto-C2', ru: 'Продукт-C2', ar: 'المنتج-ج2'  },
    p8:  { tr: 'Ürün-C3', en: 'Product-C3', de: 'Produkt-C3', fr: 'Produit-C3', es: 'Producto-C3', ru: 'Продукт-C3', ar: 'المنتج-ج3'  },
    p9:  { tr: 'Ürün-D1', en: 'Product-D1', de: 'Produkt-D1', fr: 'Produit-D1', es: 'Producto-D1', ru: 'Продукт-D1', ar: 'المنتج-د1'  },
    p10: { tr: 'Ürün-D2', en: 'Product-D2', de: 'Produkt-D2', fr: 'Produit-D2', es: 'Producto-D2', ru: 'Продукт-D2', ar: 'المنتج-د2'  },
    p11: { tr: 'Ürün-E1', en: 'Product-E1', de: 'Produkt-E1', fr: 'Produit-E1', es: 'Producto-E1', ru: 'Продукт-E1', ar: 'المنتج-هـ1' },
    p12: { tr: 'Ürün-E2', en: 'Product-E2', de: 'Produkt-E2', fr: 'Produit-E2', es: 'Producto-E2', ru: 'Продукт-E2', ar: 'المنتج-هـ2' },
    p13: { tr: 'Ürün-E3', en: 'Product-E3', de: 'Produkt-E3', fr: 'Produit-E3', es: 'Producto-E3', ru: 'Продукт-E3', ar: 'المنتج-هـ3' },
};

/** Returns translated name for a category. Falls back: lang → tr → original name */
export function translateCategoryName(id: string, originalName: string, lang: string): string {
    const map = CATEGORY_NAME_TRANSLATIONS[id];
    if (!map) return originalName;
    return map[lang] ?? map['tr'] ?? originalName;
}

/** Returns translated name for a product. Falls back: lang → tr → original name */
export function translateProductName(id: string, originalName: string, lang: string): string {
    const map = PRODUCT_NAME_TRANSLATIONS[id];
    if (!map) return originalName;
    return map[lang] ?? map['tr'] ?? originalName;
}

export const mockCategories: Category[] = [
    { id: '1', name: 'Kategori-A', slug: 'kategori-a', isActive: true, isDeleted: false, parentCategoryId: null, createdAt: new Date().toISOString(), createdBy: 'System' },
    { id: '2', name: 'Kategori-B', slug: 'kategori-b', isActive: true, isDeleted: false, parentCategoryId: null, createdAt: new Date().toISOString(), createdBy: 'System' },
    { id: '3', name: 'Kategori-C', slug: 'kategori-c', isActive: true, isDeleted: false, parentCategoryId: null, createdAt: new Date().toISOString(), createdBy: 'System' },
    { id: '4', name: 'Kategori-D', slug: 'kategori-d', isActive: true, isDeleted: false, parentCategoryId: null, createdAt: new Date().toISOString(), createdBy: 'System' },
    { id: '5', name: 'Kategori-E', slug: 'kategori-e', isActive: true, isDeleted: false, parentCategoryId: null, createdAt: new Date().toISOString(), createdBy: 'System' },
];

export const mockProducts: Product[] = [
    // ── Kategori-A (kg) ──
    {
        id: 'p1',
        name: 'Ürün-A1',
        description: 'Kategori-A grubuna ait birinci ürün.',
        price: 12.99,
        currency: 'USD',
        priceAmount: 12.99,
        priceCurrency: 'USD',
        stockQuantity: 100,
        categoryId: '1',
        categoryName: 'Kategori-A',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-a1/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p2',
        name: 'Ürün-A2',
        description: 'Kategori-A grubuna ait ikinci ürün.',
        price: 18.50,
        currency: 'USD',
        priceAmount: 18.50,
        priceCurrency: 'USD',
        stockQuantity: 45,
        categoryId: '1',
        categoryName: 'Kategori-A',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-a2/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p3',
        name: 'Ürün-A3',
        description: 'Kategori-A grubuna ait üçüncü ürün.',
        price: 24.99,
        currency: 'USD',
        priceAmount: 24.99,
        priceCurrency: 'USD',
        stockQuantity: 60,
        categoryId: '1',
        categoryName: 'Kategori-A',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-a3/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    // ── Kategori-B (adet) ──
    {
        id: 'p4',
        name: 'Ürün-B1',
        description: 'Kategori-B grubuna ait birinci ürün.',
        price: 9.99,
        currency: 'USD',
        priceAmount: 9.99,
        priceCurrency: 'USD',
        stockQuantity: 80,
        categoryId: '2',
        categoryName: 'Kategori-B',
        unitId: '3',
        unitName: 'adet',
        unitCode: 'adet',
        imageUrl: 'https://picsum.photos/seed/product-b1/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p5',
        name: 'Ürün-B2',
        description: 'Kategori-B grubuna ait ikinci ürün.',
        price: 15.00,
        currency: 'USD',
        priceAmount: 15.00,
        priceCurrency: 'USD',
        stockQuantity: 8,
        categoryId: '2',
        categoryName: 'Kategori-B',
        unitId: '3',
        unitName: 'adet',
        unitCode: 'adet',
        imageUrl: 'https://picsum.photos/seed/product-b2/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    // ── Kategori-C (kg) ──
    {
        id: 'p6',
        name: 'Ürün-C1',
        description: 'Kategori-C grubuna ait birinci ürün.',
        price: 22.50,
        currency: 'USD',
        priceAmount: 22.50,
        priceCurrency: 'USD',
        stockQuantity: 60,
        categoryId: '3',
        categoryName: 'Kategori-C',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-c1/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p7',
        name: 'Ürün-C2',
        description: 'Kategori-C grubuna ait ikinci ürün.',
        price: 14.99,
        currency: 'USD',
        priceAmount: 14.99,
        priceCurrency: 'USD',
        stockQuantity: 150,
        categoryId: '3',
        categoryName: 'Kategori-C',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-c2/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p8',
        name: 'Ürün-C3',
        description: 'Kategori-C grubuna ait üçüncü ürün.',
        price: 19.50,
        currency: 'USD',
        priceAmount: 19.50,
        priceCurrency: 'USD',
        stockQuantity: 0,
        categoryId: '3',
        categoryName: 'Kategori-C',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-c3/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    // ── Kategori-D (adet) ──
    {
        id: 'p9',
        name: 'Ürün-D1',
        description: 'Kategori-D grubuna ait birinci ürün.',
        price: 29.99,
        currency: 'USD',
        priceAmount: 29.99,
        priceCurrency: 'USD',
        stockQuantity: 35,
        categoryId: '4',
        categoryName: 'Kategori-D',
        unitId: '3',
        unitName: 'adet',
        unitCode: 'adet',
        imageUrl: 'https://picsum.photos/seed/product-d1/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p10',
        name: 'Ürün-D2',
        description: 'Kategori-D grubuna ait ikinci ürün.',
        price: 39.99,
        currency: 'USD',
        priceAmount: 39.99,
        priceCurrency: 'USD',
        stockQuantity: 25,
        categoryId: '4',
        categoryName: 'Kategori-D',
        unitId: '3',
        unitName: 'adet',
        unitCode: 'adet',
        imageUrl: 'https://picsum.photos/seed/product-d2/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    // ── Kategori-E (karışık) ──
    {
        id: 'p11',
        name: 'Ürün-E1',
        description: 'Kategori-E grubuna ait birinci ürün.',
        price: 16.99,
        currency: 'USD',
        priceAmount: 16.99,
        priceCurrency: 'USD',
        stockQuantity: 70,
        categoryId: '5',
        categoryName: 'Kategori-E',
        unitId: '1',
        unitName: 'kg',
        unitCode: 'kg',
        imageUrl: 'https://picsum.photos/seed/product-e1/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p12',
        name: 'Ürün-E2',
        description: 'Kategori-E grubuna ait ikinci ürün.',
        price: 11.50,
        currency: 'USD',
        priceAmount: 11.50,
        priceCurrency: 'USD',
        stockQuantity: 3,
        categoryId: '5',
        categoryName: 'Kategori-E',
        unitId: '3',
        unitName: 'adet',
        unitCode: 'adet',
        imageUrl: 'https://picsum.photos/seed/product-e2/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
    },
    {
        id: 'p13',
        name: 'Ürün-E3',
        description: 'Kategori-E grubuna ait üçüncü ürün.',
        price: 34.99,
        currency: 'USD',
        priceAmount: 34.99,
        priceCurrency: 'USD',
        stockQuantity: 15,
        categoryId: '5',
        categoryName: 'Kategori-E',
        unitId: '5',
        unitName: 'paket',
        unitCode: 'paket',
        imageUrl: 'https://picsum.photos/seed/product-e3/300/300',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
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
