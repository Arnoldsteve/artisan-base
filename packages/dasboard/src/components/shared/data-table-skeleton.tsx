import { Skeleton } from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';

export function DataTableSkeleton() {
  return (
    <div className="p-4 md:p-8 lg:p-10">
      {/* Page Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filter/View Options Skeleton */}
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Simulating 5 columns */}
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Create an array of 5 to map over for skeleton rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {/* Pagination Skeleton */}
       <div className="flex items-center justify-end space-x-2 py-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
        </div>
    </div>
  );
}