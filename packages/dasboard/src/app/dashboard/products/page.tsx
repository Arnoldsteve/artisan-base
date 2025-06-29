// src/app/dashboard/products/page.tsx

import { mockProducts } from '@/lib/mock-data/products';
import { ProductsView } from './components/products-view';

async function getProducts() {
  // --- ADD THIS DELAY ---
  console.log('Fetching products... this will take 2 seconds.');
  await new Promise(resolve => setTimeout(resolve, 2000));
  // ---------------------

  return mockProducts;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <ProductsView initialProducts={products} />
    </div>
  );
}