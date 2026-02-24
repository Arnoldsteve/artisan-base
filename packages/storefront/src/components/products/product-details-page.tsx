"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  ShoppingCart,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { useProduct } from "@/hooks/use-products";
import { useCartContext } from "@/contexts/cart-context"; 
import { useWishlistContext } from "@/contexts/wishlist-context";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { formatMoney } from "@/lib/money";
import { CustomerReviewSection } from "@/components/products/customer-review-section";
import StarRating from "@/components/products/star-rating";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Product } from "@/types/product"; 
import ProductDetailsSkeleton from "@/skeletons/products/product-details-skeleton";
import { Label } from "@repo/ui/components/ui/label";
import { useTenantContext } from "@/contexts/tenant-context";
import { resolveProductImages } from "@/lib/product-utils";

interface ProductDetailsPageProps {
  initialProduct: Product;
}

export default function ProductDetailsPage({ initialProduct }: ProductDetailsPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { tenant: currentTenantContext } = useTenantContext();
  const { addToCart } = useCartContext();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistContext();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProduct(slug, {
    initialData: initialProduct,
  });

  const isExternalSeller = useMemo(() => {
    if (!product) return false;
    return !currentTenantContext || currentTenantContext.id !== product.tenantId;
  }, [currentTenantContext, product]);

  const imageList = useMemo(() => resolveProductImages(product || initialProduct), [product, initialProduct]);

  /**
   * TOP 1% LOGIC: Secure Cart Insertion
   * We pass the tenantId and merchant metadata so the checkout logic
   * can correctly group items by artisan.
   */
  const handleAddToCart = () => {
    const currentProduct = product || initialProduct;
    if (!currentProduct) return;

    addToCart({
      id: currentProduct.id,
      tenantId: currentProduct.tenantId, // ✅ CRITICAL: Fixes the 'undefined' backend error
      tenantName: (currentProduct as any).tenant?.name || "Artisan Store",
      tenantSubdomain: (currentProduct as any).tenant?.subdomain,
      name: currentProduct.name,
      price: Number(currentProduct.price),
      slug: currentProduct.slug,
      description: currentProduct.description || "",
      image: imageList[0],
      quantity,
      inventoryQuantity: currentProduct.inventoryQuantity,
    });
    
    toast.success(`${currentProduct.name} added to bag.`);
  };

  if (isLoading && !product) return <ProductDetailsSkeleton />;
  if (!product && !initialProduct) return <div className="p-20 text-center">Product no longer available.</div>;

  const displayProduct = product || initialProduct;

  return (
    <section className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <nav className="text-sm text-muted-foreground">
             Products <span className="mx-2">/</span> 
             {displayProduct.categories?.[0]?.category?.name || "Uncategorized"}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-sm border bg-muted">
              <Image
                src={imageList[selectedImage]}
                alt={displayProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {imageList.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square relative rounded-sm border-2 overflow-hidden transition-all ${
                      selectedImage === idx ? "border-blue-600 ring-2 ring-blue-600/10" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="space-y-8">
            <div className="space-y-2">
              {isExternalSeller && (
                <Link 
                  href={`/shop/${(displayProduct as any).tenant?.subdomain}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                >
                  <Store className="h-3.5 w-3.5" />
                  Sold by {(displayProduct as any).tenant?.name}
                </Link>
              )}
              
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground lowercase first-letter:uppercase">
                {displayProduct.name}
              </h1>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1">
                  <StarRating rating={displayProduct.averageRating || 0} />
                  <span className="text-sm font-medium text-muted-foreground">
                    ({displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
                <Badge variant="outline" className="rounded-full font-mono text-[10px] uppercase">
                  SKU: {displayProduct.sku || 'N/A'}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-bold text-foreground">
                {formatMoney(displayProduct.price, displayProduct.currency)}
              </span>
              {displayProduct.originalPrice && (
                <span className="ml-3 text-xl text-muted-foreground line-through decoration-destructive/40">
                  {formatMoney(displayProduct.originalPrice, displayProduct.currency)}
                </span>
              )}
              <p className="text-[11px] text-green-600 font-semibold uppercase tracking-wide mt-1">
                Inclusive of all taxes
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest">Quantity</Label>
                <div className="flex items-center border rounded-sm h-11 bg-muted/10">
                  <button 
                    className="px-5 disabled:opacity-20 hover:text-blue-600 transition-colors"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="w-12 text-center font-bold text-sm tabular-nums">{quantity}</span>
                  <button 
                    className="px-5 disabled:opacity-20 hover:text-blue-600 transition-colors"
                    onClick={() => setQuantity(q => Math.min(displayProduct.inventoryQuantity, q + 1))}
                    disabled={quantity >= displayProduct.inventoryQuantity}
                  >+</button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={displayProduct.inventoryQuantity === 0}
                className="w-full h-14 font-bold uppercase tracking-widest rounded-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {displayProduct.inventoryQuantity > 0 ? "Add to Bag" : "Out of Stock"}
              </Button>
              
              {displayProduct.inventoryQuantity > 0 && displayProduct.inventoryQuantity <= 10 && (
                <p className="text-center text-xs font-bold text-orange-600 uppercase animate-pulse">
                  Only {displayProduct.inventoryQuantity} units remaining!
                </p>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed pt-6 border-t">
               {displayProduct.description}
            </div>

            {/* Logistics Assurance */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-dashed">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><Truck className="h-4 w-4" /></div>
                <div className="text-[10px] leading-tight">
                  <p className="font-bold uppercase">Global Shipping</p>
                  <p className="text-muted-foreground">Free on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><Shield className="h-4 w-4" /></div>
                <div className="text-[10px] leading-tight">
                  <p className="font-bold uppercase">Buyer Protection</p>
                  <p className="text-muted-foreground">Guaranteed artisan quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t pt-16">
          <CustomerReviewSection productId={displayProduct.id} />
        </div>
        
        <div className="mt-24">
          <ProductRecommendations currentProduct={displayProduct} />
        </div>
      </div>
    </section>
  );
}