import { Skeleton } from "@repo/ui/components/ui/skeleton";

export const OrderDetailsSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Order Date */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Status */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Total */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Items */}
      <div>
        <Skeleton className="h-4 w-28 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div>
        <Skeleton className="h-4 w-36 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </div>
    </div>
  );
};
