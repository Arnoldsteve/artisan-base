"use client";

import { memo, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Store } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types/product"; // Use the specific product type
import { useCart } from "@/hooks/use-cart";
import { formatMoney } from "@/lib/money";
import StarRating from "./products/star-rating";
import { useTenantContext } from "@/contexts/tenant-context";

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  showWishlist = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { tenant } = useTenantContext(); // 1. Identify the current UI context
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // --- Logic: Should we show the Seller? ---
  // If we are on the main marketplace (tenant is null), show seller info.
  // If we are inside a specific shop but the product belongs to another tenant (cross-sell), show it.
  const showSellerInfo = useMemo(() => {
    return !tenant || tenant.id !== product.tenantId;
  }, [tenant, product.tenantId]);

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      description: product.description || "",
      image: product.images?.[0]?.url || undefined,
      quantity: 1,
      inventoryQuantity: product.inventoryQuantity,
    });

    toast.success(`${product.name} added to cart`);
  }, [addToCart, product]);

  const formattedPrice = formatMoney(product.price, product.currency);
  
  // Enterprise Standard: Product URL changes based on context
  // Global: /shop/[subdomain]/products/[slug]
  // Isolated: /products/[slug]
  const productLink = tenant 
    ? `/products/${product.slug}` 
    : `/shop/${(product as any).tenant?.subdomain || 'view'}/products/${product.slug}`;

  return (
    <div className="bg-card rounded-sm border h-full shadow-sm hover:shadow-md transition-all duration-300 p-2 flex flex-col group">
      {/* Image Section */}
      <div className="relative aspect-square sm:aspect-[4/5] rounded-sm overflow-hidden bg-muted">
        <Link href={productLink}>
          <Image
            src={product.images?.[0]?.url || `https://picsum.photos/seed/${product.id}/400/500`}
            alt={product.name}
            fill
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isImageLoading ? "scale-110 blur-lg" : "scale-100 blur-0"
            } group-hover:scale-105`}
            onLoad={() => setIsImageLoading(false)}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>

        {showWishlist && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col pt-3 pb-1 flex-1">
        {/* 2. Seller Attribution (Jumia Style) */}
        {showSellerInfo && (
          <Link 
            href={`/shop/${(product as any).tenant?.subdomain}`}
            className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 hover:text-primary transition-colors"
          >
            <Store className="h-3 w-3" />
            {(product as any).tenant?.name || "Artisan Store"}
          </Link>
        )}

        <Link href={productLink} className="flex-1">
          <h3 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">
              {formattedPrice}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-muted-foreground">
                {formatMoney(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
          <StarRating rating={product.averageRating || 0} size="small" />
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-3">
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={product.inventoryQuantity === 0}
          className="w-full text-xs h-9 rounded-sm font-bold uppercase tracking-tighter"
        >
          {product.inventoryQuantity > 0 ? "Add to Bag" : "Sold Out"}
        </Button>
      </div>
    </div>
  );
});