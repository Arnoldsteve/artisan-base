import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

const skeletonArray = Array.from({ length: 6 });

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
}) => {
  const { data: recommendations, isLoading, error } = useRecommendations(
    currentProduct.id
  );
  const { addToCart } = useCartContext();

  const handleQuickAdd = (product: Product) => {
    const images =
      (product.images?.map((img) => img.url).filter(Boolean) ?? []);
    const imageList =
      images.length > 0
        ? images
        : [product.image || `https://picsum.photos/seed/${product.id}/400/400`];

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.sku || product.id,
      description: product.description || "",
      image: imageList[0],
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getGridCols = () =>
    "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

  // --- Loading ---
  if (isLoading) {
    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className={`grid gap-6 ${getGridCols()}`}>
          {skeletonArray.map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-muted rounded-2xl p-4 h-64 flex flex-col items-center justify-center"
            >
              <div className="bg-gray-300 h-32 w-32 rounded mb-4" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // --- Empty / Error ---
  if (error || !recommendations || recommendations.length === 0) {
    const message = error
      ? "Could not load recommendations."
      : "No recommendations found for this product.";
    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <p className="text-center text-muted-foreground py-8">{message}</p>
      </section>
    );
  }

  // --- Success ---
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className={`grid gap-6 ${getGridCols()}`}>
        {recommendations.map((product) => {
          const images =
            (product.images?.map((img) => img.url).filter(Boolean) ?? []);
          const imageList =
            images.length > 0
              ? images
              : [
                  product.image ||
                    `https://picsum.photos/seed/${product.id}/400/400`,
                ];

          return (
            <div
              key={product.id}
              className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col group"
            >
              {/* Image */}
              <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
                <Link href={`/products/${product.id}`}>
                <Image
                  src={imageList[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                </Link>
              </div>

              {/* Name */}
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-sm text-center mb-1 line-clamp-2 group-hover:text-primary transition">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground">
                  {product.rating?.toFixed(1) ?? "0.0"}
                </span>
              </div>

              {/* Price */}
              <p className="font-semibold text-primary text-center mb-3">
                {formatMoney(product.price, product.currency)}
              </p>

              {/* CTA */}
              <Button
                size="sm"
                className="w-full mt-auto rounded-xl"
                onClick={() => handleQuickAdd(product)}
                disabled={product.inventoryQuantity === 0}
              >
                {product.inventoryQuantity > 0 ? "Quick Add" : "Out of Stock"}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};