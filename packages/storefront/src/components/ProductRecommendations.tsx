import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { formatMoney } from "@/lib/money";
import Link from "next/link";
import { ProductsLoading } from "./skeletons/product-card-skeleton";
import StarRating from "./products/star-rating";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

const skeletonArray = Array.from({ length: 6 });

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
}) => {
  const {
    data: recommendations,
    isLoading,
    error,
  } = useRecommendations(currentProduct.id);
  const { addToCart } = useCartContext();

  const handleQuickAdd = (product: Product) => {
    const images = product.images?.map((img) => img.url).filter(Boolean) ?? [];
    const imageList =
      images.length > 0
        ? images
        : [product.image || `https://picsum.photos/seed/${product.id}/400/400`];

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      description: product.description || "",
      image: imageList[0],
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getGridCols = () =>
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2";

  if (isLoading) return <ProductsLoading />;

  // --- Empty / Error ---
  if (error || !recommendations || recommendations.length === 0) {
    const message = error
      ? "Could not load recommendations."
      : "No recommendations found for this product.";
    return (
      <section className="mt-8">
        {/* Show nothing if no recommendatin is found */}
      </section>
    );
  }

  // --- Success ---
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className={`grid ${getGridCols()}`}>
        {recommendations.map((product) => {
          const images =
            product.images?.map((img) => img.url).filter(Boolean) ?? [];
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
              className="bg-card rounded-sm border shadow-sm hover:shadow-md transition-all duration-300 p-2 flex flex-col group"
            >
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

              <div className="flex-1 flex flex-col space-y-2 mb-0">
                <Link href={`/products/${product.id}`}>
                  <h3 className=" text-xs line-clamp-2 group-hover:text-primary transition">
                    {product.name}
                  </h3>
                </Link>
              </div>
              <div className="mb-2 mt-1">
                <p className="text-sm md:text-md font-semibold text-foreground mb-1">
                  {formatMoney(product.price, product.currency)}
                </p>
                <div className="mt-flex justify-center">
                  <StarRating
                    rating={product.rating ?? 3.7}
                    size="small"
                    showValue={false}
                  />
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => handleQuickAdd(product)}
                disabled={product.inventoryQuantity === 0}
                className="w-full flex items-center justify-center gap-2 rounded-sm mt-auto"
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
