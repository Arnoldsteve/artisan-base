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
import { useProduct } from "@/hooks/use-products"; // Works now thanks to File 1 update
import { useCartContext } from "@/contexts/cart-context"; // FIX: Corrected import path
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

interface ProductDetailsPageProps {
  initialProduct: Product;
}

export default function ProductDetailsPage({ initialProduct }: ProductDetailsPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { tenant: currentTenantContext } = useTenantContext();
  const { addToCart } = useCartContext(); // Now correctly imported
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

  if (isLoading && !product) return <ProductDetailsSkeleton />;
  if (!product) return <div className="p-20 text-center text-muted-foreground">Product no longer available.</div>;

  const imageList = product.images?.length > 0 
    ? product.images.map(img => img.url) 
    : [`https://picsum.photos/seed/${product.id}/600/600`];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      tenantId: product.tenantId, 
      tenantName: (product as any).tenant?.name || "Artisan Store",
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      description: product.description || "",
      image: imageList[0],
      quantity,
      inventoryQuantity: product.inventoryQuantity,
    });
    toast.success(`Added ${product.name} to bag.`);
  };

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
             {product.categories?.[0]?.category?.name || "Uncategorized"}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-sm border bg-muted">
              <Image
                src={imageList[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square relative rounded-sm border-2 overflow-hidden ${
                    selectedImage === idx ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              {isExternalSeller && (
                <Link 
                  href={`/shop/${(product as any).tenant?.subdomain}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                >
                  <Store className="h-3.5 w-3.5" />
                  Sold by {(product as any).tenant?.name}
                </Link>
              )}
              
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1">
                  <StarRating rating={product.averageRating || 0} />
                  <span className="text-sm font-medium">({product.reviewCount})</span>
                </div>
                <Badge variant="outline" className="rounded-full">
                  SKU: {product.sku}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {formatMoney(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                    {formatMoney(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase">Quantity</Label>
                <div className="flex items-center border rounded-sm h-10 bg-muted/20">
                  <button 
                    className="px-4 disabled:opacity-20 font-bold"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    className="px-4 disabled:opacity-20 font-bold"
                    onClick={() => setQuantity(q => Math.min(product.inventoryQuantity, q + 1))}
                    disabled={quantity >= product.inventoryQuantity}
                  >+</button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.inventoryQuantity === 0}
                className="w-full h-12 font-bold uppercase tracking-widest rounded-sm"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inventoryQuantity > 0 ? "Add to Bag" : "Out of Stock"}
              </Button>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed pt-4 border-t">
               {product.description}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <CustomerReviewSection productId={product.id} />
        </div>
        
        <div className="mt-20">
          <ProductRecommendations currentProduct={product} />
        </div>
      </div>
    </section>
  );
}