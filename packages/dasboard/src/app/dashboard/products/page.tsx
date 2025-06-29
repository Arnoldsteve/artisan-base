import { mockProducts } from '@/lib/mock-data/products';
import { ProductList } from '@/components/products/product-list';

async function getProducts() {
  return mockProducts;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <ProductList initialProducts={products} />
    </div>
  );
}