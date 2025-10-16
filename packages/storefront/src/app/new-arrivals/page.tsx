"use client";

import { ProductCard } from "@/components/product-card";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { useNewArrivals } from "@/hooks/use-products";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Clock, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function NewArrivalsPage() {
  const { data: productsResponse, isLoading } = useNewArrivals(12);
  const products = productsResponse || [];

  if (isLoading) return <ProductsLoading />;

  return (
    <section className="bg-[#f4f4f4]">
      <div className="container mx-auto px-2 md:px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">New Arrivals</h1>
          </div>
          <p className="text-muted-foreground text-sm">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.map((product, index) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-start">
              <div className="bg-[#fff] rounded-lg p-8 border border-green-100">
                <h3 className="text-xl font-semibold text-foreground mb-0">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground  text-sm mb-4">
                  Get notified when new products arrive from our talented
                  artisans
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                  <Link
                    href="/products"
                  >
                    <Button>Browse All Products</Button>
                  </Link>
                  <Link
                    href="/featured"
                  >
                    <Button variant="outline">Featured Items</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-muted/10 rounded-lg p-0 md:p-6">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">
                    Fresh Daily
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    New products added regularly
                  </p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">
                    Trending
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Latest styles and designs
                  </p>
                </div>
                <div>
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">
                    Exclusive
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Limited edition pieces
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
