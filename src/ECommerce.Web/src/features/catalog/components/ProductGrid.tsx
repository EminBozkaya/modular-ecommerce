import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="relative">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
