import React from "react";
import { Product } from "@/types";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

// An array to map over for rendering skeleton loaders.
const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8];

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
}) => {
  // It's a good practice to destructure the `data` property from useQuery
  const { data: recommendations, isLoading, error } = useRecommendations(
    currentProduct.id
  );
  const { addToCart } = useCartContext();

  const getGridCols = () =>
    "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8";

  const handleQuickAdd = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.sku || product.id,
      description: product.description || "",
      image: product.image || (product.images && product.images[0]) || "",
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  // --- Start of The Corrected Rendering Logic ---

  // Guard Clause 1: Handle the loading state first.
  // This shows a placeholder UI while data is being fetched.
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

  // Guard Clause 2: Handle all "unsuccessful" states after loading.
  // This checks for a network error, OR if the data is undefined (which caused the crash),
  // OR if the data is an empty array.
  if (error || !recommendations || recommendations.length === 0) {
    const message = error
      ? "Could not load recommendations."
      // This message shows if the API returns an empty array `[]`
      : "No recommendations found for this product.";
    
    // We still render the title, just with a message below it.
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

  // The "Happy Path": If the code reaches this point, we are GUARANTEED that
  // `recommendations` is an array with at least one product. It is now safe to render.
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        You might also like
      </h2>
      <div className={`grid gap-6 ${getGridCols()}`}>
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center group border border-gray-100 hover:border-primary"
          >
            <img
              src={
                product.image ||
                (product.images && product.images[0]) ||
                // Fallback image to prevent errors
                `https://picsum.photos/200/200?random=${product.id}`
              }
              alt={product.name}
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
                    // Using `?? 0` as a safety net in case rating is null/undefined
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
                // Using `?? 0` as a safety net in case price is null/undefined
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
        ))}
      </div>
    </div>
  );
};