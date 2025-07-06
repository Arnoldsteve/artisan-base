import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductsGrid } from "@/components/products-grid";
import { ProductsFilter } from "@/components/products-filter";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              All Products
            </h1>
            <p className="text-muted-foreground">
              Browse our complete collection of handcrafted products
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <ProductsFilter />
            </aside>
            <div className="lg:col-span-3">
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductsGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
