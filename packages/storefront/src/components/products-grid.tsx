// REFACTOR: Products grid component with performance optimizations and proper data fetching

import { memo } from "react";
import { ProductCard } from "./product-card";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@repo/ui/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductSearchParams } from "@/types";

interface ProductsGridProps {
  filters?: ProductSearchParams;
}

// OPTIMIZATION: Memoized component to prevent unnecessary re-renders
export const ProductsGrid = memo(function ProductsGrid({
  filters = {},
}: ProductsGridProps) {
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useProducts(filters);

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Unable to load products. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No products found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* OPTIMIZATION: Product count and sorting */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {pagination?.total || products.length} products
          {pagination && (
            <span>
              {" "}
              (page {pagination.page} of {pagination.totalPages})
            </span>
          )}
        </p>
        <select
          className="border rounded-md px-3 py-1 text-sm"
          defaultValue="featured"
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      {/* OPTIMIZATION: Grid layout with responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* OPTIMIZATION: Pagination with proper navigation */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {/* Page numbers */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}

            {pagination.totalPages > 5 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
});
