// In packages/web/src/app/[storeId]/products/[productId]/page.tsx

import { getPublicProduct, getPublicStoreInfo } from '@/lib/api';
import { PublicLayout } from '@/components/public/public-layout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ProductDetailPageProps {
  params: {
    storeId: string;
    productId: string;
  };
}

// Dynamic metadata for this page too!
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getPublicProduct(params.storeId, params.productId);
  return {
    title: product ? `${product.name} - ${params.storeId}` : 'Product Not Found',
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { storeId, productId } = params;

  const [storeInfo, product] = await Promise.all([
    getPublicStoreInfo(storeId),
    getPublicProduct(storeId, productId),
  ]);

  if (!storeInfo || !product) {
    notFound();
  }

  return (
    <PublicLayout storeName={storeInfo.name}>
      <div className="container mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg">
            {product.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-3xl mt-2">${product.price}</p>
            {product.description && (
              <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
            )}
            {/* Add to Cart button would go here */}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}