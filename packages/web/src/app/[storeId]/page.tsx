// In packages/web/src/app/[storeId]/page.tsx

import { getPublicStoreProducts } from '@/lib/api';
import { notFound } from 'next/navigation';

interface StorePageProps {
  params: {
    storeId: string;
  };
}

// This is a Server Component, so we can make it async
export default async function StorePage(props: { params: { storeId: string } }) {
  const { params } = props; // De-structure from props instead of the argument directly
  const products = await getPublicStoreProducts(params.storeId);

  // If the store doesn't exist (our API function returns null), show a 404 page
  if (!products) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8">
      {/* We'll fetch the store name later, for now we use the ID */}
      <h1 className="text-4xl font-bold mb-2">Welcome to {params.storeId}</h1>
      <p className="text-lg text-muted-foreground mb-8">Browse our unique products below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gray-200">
                {product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 mt-1">${product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>This store has no products yet.</p>
        )}
      </div>
    </div>
  );
}