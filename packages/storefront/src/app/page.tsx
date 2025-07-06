// REFACTOR: Homepage with optimized performance and proper error handling

import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featured-products";
import { CategoryShowcase } from "@/components/category-showcase";
import { Testimonials } from "@/components/testimonials";
import { Newsletter } from "@/components/newsletter";

// OPTIMIZATION: Loading component for better UX
function LoadingSection() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <Suspense fallback={<LoadingSection />}>
        <FeaturedProducts />
      </Suspense>

      {/* Category Showcase */}
      <Suspense fallback={<LoadingSection />}>
        <CategoryShowcase />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<LoadingSection />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
