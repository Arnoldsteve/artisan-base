import { createMetadata } from "@/lib/metadata";
import ProductDetailsPage from "@/components/products/product-details-page";
import { productService } from "@/services/product-service";
import { formatMoney } from "@/lib/money";
import { notFound } from "next/navigation";

/**
 * TOP 1% ARCHITECTURE: Server-Side Fetching
 * For millions of users, SEO is the primary driver of traffic.
 * This server component ensures Google sees the full product content instantly.
 */
async function fetchProduct(slug: string) {
  try {
    // FIX: Using the refactored slug lookup
    // In this 'Global' route, we don't send x-tenant-id, allowing 
    // the backend to return the product from any artisan store.
    const product = await productService.getProductBySlug(slug);
    return product;
  } catch (e) {
    console.error(`[Server] Error fetching product slug: ${slug}`, e);
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
      title: "Product Not Found | Artisan Base",
      description: "The handcrafted item you are looking for is no longer available.",
    });
  }

  const formattedPrice = formatMoney(product.price, product.currency);
  
  return createMetadata({
    title: `${product.name} | ${product.sku} | Artisan Base`,
    description: product.description?.slice(0, 160) || `Buy ${product.name} for ${formattedPrice}.`,
    openGraph: {
      title: product.name,
      images: [
        {
          url: product.images?.[0]?.url || "/default-og.png",
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

  // Enterprise Standard: Use Next.js notFound() to trigger the 404 page
  if (!product) {
    notFound();
  }

  /**
   * SOLID: The Page handles data fetching (Server) 
   * and delegates the UI to a Client Component.
   */
  return <ProductDetailsPage initialProduct={product} />;
}