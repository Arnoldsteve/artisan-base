import { Product } from "@/types/product";

/**
 * TOP 1% LOGIC: Image Resolver
 * 
 * Responsibility: Normalizes product image data for UI consumption.
 * millions of users: Prevents "Broken Image" layout shifts by ensuring 
 * a high-quality fallback is always present.
 */
export function resolveProductImages(product: Partial<Product> | null | undefined): string[] {
  // Enterprise Standard: Consistent high-quality placeholder
  const placeholder = `https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80`;

  // 🛡️ Safety Guard: Handle null or products without image arrays
  if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
    return [placeholder];
  }

  const urls = product.images
    .map((img) => {
      // ⚡ Robust Extraction: Handle both raw strings and ProductImage objects
      const url = typeof img === "string" ? img : img?.url;
      
      // Sanitization: If URL is a dummy placeholder from test data, swap for luxury placeholder
      if (url?.includes("cdn.com") || url === "placeholder.jpg") return placeholder;
      
      return url;
    })
    // 🧹 Type Guard: Filter out empty strings, nulls, or undefined
    .filter((url): url is string => !!url && typeof url === "string" && url.trim() !== "");

  return urls.length > 0 ? urls : [placeholder];
}