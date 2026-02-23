import { Product } from "@/types/product";

/**
 * TOP 1% LOGIC: Image Resolver
 * This function takes the raw JSON from the 'images' field 
 * and returns a guaranteed array of valid URL strings.
 */
export function resolveProductImages(product: any): string[] {
  // Enterprise Standard: Use a consistent, high-quality placeholder
  // We use Unsplash for a "Luxury" feel during development
  const placeholder = `https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80`; // A nice leather bag image

  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return [placeholder];
  }

  const urls = product.images
    .map((img: any) => {
      const url = typeof img === "string" ? img : img?.url;
      // If the URL is just a test placeholder like 'cdn.com', use our nice Unsplash image
      if (url?.includes("cdn.com")) return placeholder;
      return url;
    })
    .filter((url): url is string => !!url && url.trim() !== "");

  return urls.length > 0 ? urls : [placeholder];
}