import { getPublicStoreProducts, getPublicStoreInfo } from "@/lib/api";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/public/public-layout";
import { ProductCard } from "@/components/public/product-card";
import { Metadata } from "next";
import Link from "next/link";

interface StorePageProps {
  params: {
    storeId: string;
  };
}
export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const storeInfo = await getPublicStoreInfo(params.storeId);
  if (!storeInfo) {
    return {
      title: "Store Not Found",
    };
  }
  return {
    title: `${storeInfo.name} | ArtisanBase`,
    description: `Explore the unique collection from ${storeInfo.name}.`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = params;

  // Fetch store info and products in parallel for better performance
  const [storeInfo, products] = await Promise.all([
    getPublicStoreInfo(storeId),
    getPublicStoreProducts(storeId),
  ]);

  // If either call fails (e.g., store not found), show a 404 page
  if (!storeInfo || !products) {
    notFound();
  }

  return (
    <PublicLayout storeName={storeInfo.name}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Our Collection
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Handcrafted with passion. Explore our unique products below.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Use any remove and make a better typescript */}
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/${storeId}/products/${product.id}`}
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">Coming Soon!</h3>
            <p className="text-muted-foreground mt-2">
              This artisan is preparing their collection. Check back soon!
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
