import { createMetadata } from "@/lib/metadata";
import ProductDetailsPage from "@/components/products/product-details-page";
import { productService } from "@/services/product-service";
import { notFound } from "next/navigation";

/**
 * SOLID Principle: DRY
 * We reuse the exact same logic as the global products page.
 * This handles the "Isolated Aisle" view for a specific merchant.
 */
async function fetchProduct(slug: string) {
  try {
    return await productService.getProductBySlug(slug);
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const product = await fetchProduct(productSlug);
  if (!product) return { title: "Product Not Found" };

  return createMetadata({
    title: `${product.name} | ${product.sku} | Artisan Base`,
    description: product.description?.slice(0, 160),
  });
}

export default async function Page({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const product = await fetchProduct(productSlug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage initialProduct={product} />;
}