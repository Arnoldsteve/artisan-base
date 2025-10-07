"use client";

import { ProductCard } from "@/components/product-card";
import { useFeaturedProducts } from "@/hooks/use-products";
import { Badge } from "@repo/ui/components/ui/badge";
import { Star, Sparkles } from "lucide-react";

export default function FeaturedPage() {
  const { data: productsResponse, isLoading } = useFeaturedProducts(12);
  const products = productsResponse || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Featured Items
          </h1>
        </div>
        <p className="text-muted-foreground">
          Discover our handpicked collection of exceptional artisan products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No featured products available
          </h2>
          <p className="text-muted-foreground">
            Check back soon for our latest featured items.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                {/* Featured Badge */}
                <div className="absolute top-3.5 right-2 z-10">
                   <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Want to see more?
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore our complete collection of handcrafted products
              </p>
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse All Products
                <Sparkles className="h-4 w-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 