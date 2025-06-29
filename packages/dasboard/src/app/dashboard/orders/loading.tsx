// src/app/dashboard/orders/loading.tsx
import { DataTableSkeleton } from '@/components/shared/data-table';

export default function Loading() {
  // We can reuse the exact same skeleton component!
  return <DataTableSkeleton />;
}