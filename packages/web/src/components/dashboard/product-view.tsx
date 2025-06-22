// packages/web/src/components/dashboard/product-view.tsx
'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Products</h2>
          <p className="text-muted-foreground">Manage the products for {store.name}.</p>
        </div>
        <AddProductDialog />
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}