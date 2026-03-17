import { useNavigate } from 'react-router-dom';
import type { Product } from '../../catalog/types/product';

interface LowStockTableProps {
    products: Product[];
}

export function LowStockTable({ products }: LowStockTableProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">Düşük Stok Uyarıları</h3>
            {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">Düşük stoklu ürün bulunmuyor.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Ürün</th>
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Kategori</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-border hover:bg-accent cursor-pointer transition-colors"
                                    onClick={() => {
                                        if (!window.getSelection()?.toString()) {
                                            navigate('/admin/products');
                                        }
                                    }}
                                >
                                    <td className="py-2.5 px-3 font-medium text-foreground">{product.name}</td>
                                    <td className="py-2.5 px-3 text-muted-foreground">{product.categoryName}</td>
                                    <td className="py-2.5 px-3 text-right">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                product.stockQuantity === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : product.stockQuantity <= 3
                                                      ? 'bg-orange-100 text-orange-700'
                                                      : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
