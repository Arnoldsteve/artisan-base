"use client";

import { ProductCard } from "@/components/product-card";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useFeaturedProducts } from "@/hooks/use-products";
import { Badge } from "@repo/ui/components/ui/badge";
import { Star, Sparkles } from "lucide-react";

export default function FeaturedPage() {
  const { data: productsResponse, isLoading } = useFeaturedProducts(12);
  const products = productsResponse || [];

  if (isLoading) return <ProductsLoading />;

  return (
    <section className="py-4 bg-[#f4f4f4]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Star className="h-3 w-3 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Featured Items
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.map((product) => (
                <div key={product.id} className="relative">
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
    </section>
  );
}
