"use client";

import { ProductCard } from "@/components/product-card";
import { useNewArrivals } from "@/hooks/use-products";
import { Badge } from "@repo/ui/components/ui/badge";
import { Clock, Sparkles, TrendingUp } from "lucide-react";

export default function NewArrivalsPage() {
  const { data: productsResponse, isLoading } = useNewArrivals(12);
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
          <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            New Arrivals
          </h1>
        </div>
        <p className="text-muted-foreground">
          Be the first to discover our latest handcrafted treasures
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No new products available
          </h2>
          <p className="text-muted-foreground">
            Check back soon for fresh arrivals from our artisans.
          </p>
        </div>
      ) : (
        <>
          {/* New Arrivals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="relative">
                {/* New Badge */}
                <div className="absolute top-3.5 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    New
                  </Badge>
                </div>
                
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border border-green-100">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-muted-foreground mb-4">
                Get notified when new products arrive from our talented artisans
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse All Products
                  <Sparkles className="h-4 w-4" />
                </a>
                <a
                  href="/featured"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                >
                  Featured Items
                  <TrendingUp className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-muted/30 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground mb-1">Fresh Daily</h4>
                <p className="text-sm text-muted-foreground">
                  New products added regularly
                </p>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground mb-1">Trending</h4>
                <p className="text-sm text-muted-foreground">
                  Latest styles and designs
                </p>
              </div>
              <div>
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground mb-1">Exclusive</h4>
                <p className="text-sm text-muted-foreground">
                  Limited edition pieces
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 