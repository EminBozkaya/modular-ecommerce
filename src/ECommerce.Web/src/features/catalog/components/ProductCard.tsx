import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice } from '../../../utils/formatters';
import { AddToBasketButton } from '../../basket/components/AddToBasketButton';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const inStock = product.stockQuantity > 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
            <Link to={`/products/${product.id}`} className="aspect-square w-full overflow-hidden bg-gray-100 flex items-center justify-center relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                        <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">No image available</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4 space-y-2">
                <p className="text-sm text-gray-500 font-medium">
                    {product.categoryName}
                </p>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                    <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </Link>
                </h3>
                <div className="flex-1 flex flex-col justify-end">
                    <p className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price, product.currency)}
                    </p>
                </div>
                <div className="mt-4">
                    <AddToBasketButton productId={product.id} disabled={!inStock} />
                </div>
            </div>
        </div>
    );
}
