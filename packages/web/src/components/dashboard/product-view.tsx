// In packages/web/src/components/dashboard/product-view.tsx
'use client';

import { useCallback, useEffect, useState } from 'react'; // <-- Import useCallback
import { getProducts } from '@/lib/api';
import { Product, Store } from '@/lib/types';
import { AddProductDialog } from './product/add-product-dialog';
import { ProductList } from './product/product-list';

interface ProductViewProps {
  store: Store;
}

export function ProductView({ store }: ProductViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Create a function to fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback memoizes the function

  // 2. Call it once on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Products</h2>
          <p className="text-muted-foreground">Manage the products for {store.name}.</p>
        </div>
        {/* 3. Pass the fetchProducts function as a prop */}
        <AddProductDialog onProductAdded={fetchProducts} />
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        // 4. Pass the fetchProducts function to the list as well
        <ProductList products={products} onProductMutated={fetchProducts} />
      )}
    </div>
  );
}