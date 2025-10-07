"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Star, Heart, Share2, Truck, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useProduct } from "@/hooks/use-products";
import { useCartContext } from "@/contexts/cart-context";
import { useWishlistContext } from "@/contexts/wishlist-context";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { formatMoney } from "@/lib/money";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProduct(productId);
  const { addToCart } = useCartContext();
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useWishlistContext();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Normalize images
  const images = (product.images?.map((img) => img.url) ?? []).filter(Boolean);
  const imageList =
    images.length > 0
      ? images
      : [product.image || `https://picsum.photos/seed/${product.id}/600/600`];

  const formattedPrice = formatMoney(product.price);
  const originalPrice = product.originalPrice
    ? formatMoney(product.originalPrice)
    : null;

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.sku || product.id,
      description: product.description || "",
      image: imageList[0],
      quantity,
      inventoryQuantity: product.inventoryQuantity,
    });
    toast.success(`${product.name} has been added to your cart.`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageList[0],
        category: product.categories?.[0]?.name || "Uncategorized",
        slug: product.sku || product.id,
        description: product.description || "",
        inventoryQuantity: product.inventoryQuantity,
      });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="text-muted-foreground hover:text-foreground"
        >
          Products
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(
            product.categories?.[0]?.name || ""
          )}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {product.categories?.[0]?.name || "Uncategorized"}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={imageList[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {imageList.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imageList.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">
                {product.categories?.[0]?.name || "Uncategorized"}
              </Badge>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleWishlist}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                {formattedPrice}
              </span>
              {originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product.inventoryQuantity > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inventoryQuantity > 0
                ? `${product.inventoryQuantity} in stock`
                : "Out of stock"}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-foreground">
                Quantity:
              </label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuantity(
                      Math.min(product.inventoryQuantity, quantity + 1)
                    )
                  }
                  disabled={quantity >= product.inventoryQuantity}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.inventoryQuantity === 0}
              className="w-full"
              size="lg"
            >
              {product.inventoryQuantity > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  On orders over Ksh 1000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">30-Day Returns</p>
                <p className="text-sm text-muted-foreground">Easy returns</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <ProductRecommendations currentProduct={product} />
    </div>
  );
}
