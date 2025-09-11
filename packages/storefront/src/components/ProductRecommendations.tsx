import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

// Skeleton loader placeholders
const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8];

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
}) => {
  const { data: recommendations, isLoading, error } = useRecommendations(
    currentProduct.id
  );
  const { addToCart } = useCartContext();

  const getGridCols = () =>
    "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8";

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

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          You might also like
        </h2>
        <div className={`grid gap-6 ${getGridCols()}`}>
          {skeletonArray.map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-muted rounded-lg p-4 h-64 flex flex-col items-center justify-center"
            >
              <div className="bg-gray-300 h-32 w-32 rounded mb-4" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Error or Empty State ---
  if (error || !recommendations || recommendations.length === 0) {
    const message = error
      ? "Could not load recommendations."
      : "No recommendations found for this product.";
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          You might also like
        </h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  // --- Happy Path ---
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        You might also like
      </h2>
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
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center group border border-gray-100 hover:border-primary"
            >
              <Image
                src={imageList[0]}
                alt={product.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded mb-3 group-hover:scale-105 transition-transform"
              />
              <h3 className="font-semibold text-center text-foreground mb-1 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product.reviewCount ?? 0})
                </span>
              </div>
              <div className="font-bold text-lg text-primary mb-2">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price ?? 0)}
              </div>
              <Button
                size="sm"
                className="w-full mt-auto"
                onClick={() => handleQuickAdd(product)}
                disabled={product.inventoryQuantity === 0}
              >
                {product.inventoryQuantity > 0 ? "Quick Add" : "Out of Stock"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
