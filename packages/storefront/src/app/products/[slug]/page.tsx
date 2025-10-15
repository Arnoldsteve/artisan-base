// src/app/products/[slug]/page.tsx
import { createMetadata } from "@/lib/metadata";
import ProductDetailsPage from "@/components/products/product-details-page";
import { productService } from "@/services/product-service";

async function fetchProduct(identifier: string) {
  try {
    const product = await productService.getProduct(identifier);
    return product;
  } catch (e) {
    console.error("Error fetching product:", e);
    return null;
  }
}

interface PageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

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
          url:
            typeof product.image === "string"
              ? product.image
              : product.image?.url,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) return <div className="justify-center">Product not found.</div>;
  return <ProductDetailsPage initialProduct={product} />;
}
