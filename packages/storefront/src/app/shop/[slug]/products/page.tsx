import { ProductsContent } from '@/components/products/product-list-page';

export default function MerchantProductsPage() {
  // We reuse the same component! 
  // It will automatically become isolated because it's inside the TenantProvider
  return <ProductsContent />;
}