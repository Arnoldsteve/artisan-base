import { mockProducts } from '@/lib/mock-data/products';
import { Product } from '@/types/products';
// import { columns } from './columns';
// import { DataTable } from '@/components/shared/data-table';
import { Button } from '@repo/ui';
import { ProductList } from '@/components/products/product-list';

// This function fetches the data on the server.
// Replace with a real API call when ready.
async function getProducts(): Promise<Product[]> {
   // --- ADD THIS DELAY ---
  console.log('Fetching products... this will take 2 seconds.');
  await new Promise(resolve => setTimeout(resolve, 2000));
  // ---------------------
  return mockProducts;
  // simulate an error for demonstration purposes
  // Uncomment the line below to simulate a database connection error.
  //  throw new Error('Simulated Database Connection Failed!');
}

// The page is an async Server Component.
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage all products for your store.</p>
        </div>
        <Button>Add Product</Button>
      </div>

      {/* Render the client component with the initial data */}
      <ProductList initialProducts={products} />
    </div>
  );
}