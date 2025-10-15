import { createMetadata } from "@/lib/metadata";
import ProductDetailsPage from "@/components/products/product-details-page";
import { productService } from "@/services/product-service";

async function fetchProduct(id: string) {
  try {
    return await productService.getProduct(id);
  } catch (e) {
    console.error("Error fetching product:", e);
    return null;
  }
}

interface PageParams {
  id: string;
}

export async function generateMetadata({ params }: { params: PageParams }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return createMetadata({
      title: "Product Not Found - Artisan Base",
      description: "This product does not exist or has been removed.",
    });
  }

  return createMetadata({
    title: `${product.name} - Artisan Base`,
    description: product.description || "Beautiful handcrafted product.",
    openGraph: {
      title: product.name,
      images: [
        {
          url: product.image || "/default-og.png",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  });
}

export default async function Page({ params }: { params: PageParams }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return <ProductDetailsPage initialProduct={product} />;
}
