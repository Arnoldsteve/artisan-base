// REFACTOR: Homepage with optimized performance and proper error handling

import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featured-products";
import { CategoryShowcase } from "@/components/category-showcase";
import { Testimonials } from "@/components/testimonials";
import { Newsletter } from "@/components/newsletter";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";


export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <Suspense fallback={<ProductsLoading />}>
        <FeaturedProducts />
      </Suspense>

      {/* Category Showcase */}
      <Suspense fallback={<ProductsLoading />}>
        <CategoryShowcase />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<ProductsLoading />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
