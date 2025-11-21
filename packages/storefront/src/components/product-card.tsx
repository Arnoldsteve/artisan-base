"use client";

import { memo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { formatMoney } from "@/lib/money";
import StarRating from "./products/star-rating";

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  showWishlist = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState({
    name: "",
    price: 0,
    image: "",
    quantity: 1,
  });

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      description: product.description || "",
      image: product.images?.[0]?.url || product.image || undefined,
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
    });

    toast.success(`${product.name} has been added to your cart.`);
  }, [addToCart, product]);

  const handleToggleWishlist = useCallback(() => {
    setIsWishlisted((prev) => !prev);
    toast.success(
      isWishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  }, [product.name, isWishlisted]);

  const formattedPrice = formatMoney(product.price, product.currency);
  const originalPrice = product.originalPrice
    ? formatMoney(product.originalPrice, product.currency)
    : null;

  return (
    <div className="bg-card rounded-sm border h-full shadow-sm hover:shadow-md transition-all duration-300 p-2 flex flex-col group">
      <div className="relative aspect-square sm:aspect-[4/5] rounded-t-md overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={
              product.images?.[0]?.url ||
              `https://picsum.photos/seed/${product.id}/400/400`
            }
            alt={product.name}
            fill
            className={`h-full w-full object-cover transition-transform duration-300 ${
              isImageLoading ? "blur-md" : "blur-0"
            } group-hover:scale-105`}
            onLoad={() => setIsImageLoading(false)}
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 
                  (max-width: 1024px) 33vw, 
                  (max-width: 1280px) 20vw, 
                  16vw"
          />
        </Link>
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {showWishlist && (
          <Button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white transition"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </Button>
        )}
      </div>

      <div className="flex flex-col px-0 py-2 flex-1">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-sm line-clamp-2 text-foreground group-hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1 mb-2">
          <span className="text-sm md:text-md font-semibold text-foreground">
            {formattedPrice}
          </span>
          {originalPrice && (
            <span className="text-sm line-through text-muted-foreground">
              {originalPrice}
            </span>
          )}
        </div>
        <div className="mb-2">
          <StarRating rating={product.rating ?? 3.7} size="small" />
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={product.inventoryQuantity === 0}
          className="w-full flex items-center justify-center gap-2 rounded-lg"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inventoryQuantity > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
});
