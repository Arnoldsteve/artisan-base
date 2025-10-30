import { Skeleton } from "@repo/ui/components/ui/skeleton";

export default function LoadingBillingPage() {
  return (
    <>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}
