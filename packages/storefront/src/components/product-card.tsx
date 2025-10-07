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
import StarRating from "./star-rating";

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  showWishlist = false,
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.id,
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
    <div 
      className="bg-card rounded-2xl border h-full shadow-sm hover:shadow-md transition-all duration-300 p-3 flex flex-col group"
    >
      {/* Image Section */}
      <div className="relative aspect-square rounded-t-md overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={
              product.images?.[0]?.url ||
              `https://picsum.photos/seed/${product.id}/400/400`
            }
            alt={product.name}
            width={400}
            height={400}
            className={`h-full w-full object-cover transition-transform duration-300 ${
              isImageLoading ? "blur-md" : "blur-0"
            } group-hover:scale-105`}
            onLoad={() => setIsImageLoading(false)}
            loading="lazy"
          />
        </Link>
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Wishlist */}
        {showWishlist && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white transition"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        )}
        {/* <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
          {product.categories?.length
            ? product.categories[0].name
            : "Uncategorized"}
        </div> */}
      </div>

      {/* Content */}
      <div className="flex flex-col px-0 py-2 flex-1">
        {/* Rating + Stock */}
        {/* ({product.reviewCount ?? 0}) */}
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          <StarRating rating={product.rating ?? 3.7} />

          {/* Stock badge */}
          <span
            className={`text-[10px] px-2 py-1 rounded-full flex items-center justify-center ${
              product.inventoryQuantity > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.inventoryQuantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="text-sm line-clamp-2 text-foreground group-hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <span className="text-md font-semibold text-foreground">
            {formattedPrice}
          </span>
          {originalPrice && (
            <span className="text-sm line-through text-muted-foreground">
              {originalPrice}
            </span>
          )}
        </div>

        {/* CTA */}
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
