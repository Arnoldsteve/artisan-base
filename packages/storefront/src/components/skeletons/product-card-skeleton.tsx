import { Skeleton } from "@repo/ui/components/ui/skeleton";
import React from "react";

export function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header placeholder */}
      {/* <div className="animate-pulse mb-8">
        <Skeleton className="h-10 w-1/4 rounded-md" />
      </div> */}

      {/* Product grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-3 p-4 border rounded-xl shadow-sm"
          >
            {/* Image placeholder */}
            <Skeleton className="h-[180px] w-full rounded-xl" />

            {/* Text placeholders */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>

            {/* Button placeholder */}
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
