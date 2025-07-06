import { Suspense } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featured-products";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div>Loading products...</div>}>
          <FeaturedProducts />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
