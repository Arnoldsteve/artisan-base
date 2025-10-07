import React from "react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Product title */}
        <Skeleton className="h-6 w-1/4 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product image placeholder */}
          <Skeleton className="h-[400px] w-full rounded-xl" />

          {/* Product info placeholders */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-10 w-1/3 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
