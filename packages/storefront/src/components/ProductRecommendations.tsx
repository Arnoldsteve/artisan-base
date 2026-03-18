"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product"; // 🎯 Strict Enterprise Type
import { useRecommendations } from "@/hooks/use-recommendations";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import Link from "next/link";
import { ProductsLoading } from "./skeletons/product-card-skeleton";
import StarRating from "./products/star-rating";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
}) => {
  const {
    data: recommendations,
    isLoading,
    error,
  } = useRecommendations(currentProduct.id);
  
  const { addToCart } = useCartContext();

  /**
   * ⚡ Quick Add Logic
   * Handles 1M student/product scale by ensuring tenantId is preserved 
   * and image fallbacks are consistent.
   */
  const handleQuickAdd = (product: Product) => {
    // Extract first image URL safely
    const primaryImage = product.images?.[0]?.url || 
                         `https://picsum.photos/seed/${product.id}/400/400`;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      description: product.description || "",
      image: primaryImage, // Maps to 'image' string in CartItem
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
      tenantId: product.tenantId, // 🛡️ Multi-tenant Security
    });
    
    toast.success(`${product.name} added to cart!`);
  };

  const getGridCols = () =>
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4";

  if (isLoading) return <ProductsLoading />;

  // --- Empty / Error Handling ---
  if (error || !recommendations || recommendations.length === 0) {
    return null; // Silent return for cleaner UI on no-data scenarios
  }

  // --- Success Render ---
  return (
    <section className="mt-12 border-t pt-12">
      <h2 className="text-2xl font-black tracking-tight mb-8">You might also like</h2>
      <div className={getGridCols()}>
        {recommendations.map((product: Product) => {
          // Resolve primary image for this specific card
          const displayImage = product.images?.[0]?.url || 
                               `https://picsum.photos/seed/${product.id}/400/400`;

          return (
            <div
              key={product.id}
              className="bg-card rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-3 flex flex-col group"
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-slate-50">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
              </div>

              <div className="flex-1 flex flex-col space-y-1 mb-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center">
                  <StarRating
                    rating={product.averageRating || 0} // Using the new averageRating field
                    size="small"
                    showValue={false}
                  />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-lg font-black text-slate-900">
                  {formatMoney(product.price, product.currency)}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleQuickAdd(product)}
                disabled={product.inventoryQuantity === 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg mt-auto font-bold active:scale-95 transition-transform"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.inventoryQuantity > 0 ? "Quick Add" : "Out of Stock"}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};