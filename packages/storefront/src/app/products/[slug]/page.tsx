import { createMetadata } from "@/lib/metadata";
import ProductDetailsPage from "@/components/products/product-details-page";
import { productService } from "@/services/product-service";
import { formatMoney } from "@/lib/money";

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

  const formattedPrice = formatMoney(product.price, product.currency);
  const inStock = product.inventoryQuantity > 0;

  const description = product.description
    ? `${product.description.slice(0, 150)}... | ${formattedPrice} | ${inStock ? "In Stock" : "Out of Stock"} | Handcrafted with care.`
    : `Buy ${product.name} for ${formattedPrice}. Handcrafted artisan product. ${inStock ? "Available now" : "Currently unavailable"}.`;

  return createMetadata({
    title: `${product.name} | Buy Handcrafted ${product.categories?.[0]?.name || 'Artisan Product'} - Artisan Base`,
    description,

    openGraph: {
      title: product.name,
      images: [
        {
          url:
            typeof product.image === "string"
              ? product.image
              : (product.image as { url?: string })?.url ||
                "/default-image.jpg",
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
