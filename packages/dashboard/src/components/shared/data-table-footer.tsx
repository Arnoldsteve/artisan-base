"use client";

import { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "@repo/ui";

/**
 * Props for the DataTablePagination component.
 * It requires the table instance and the total number of items from the server.
 */
interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  totalCount: number;
}

export function DataTablePagination<TData>({
  table,
  totalCount,
}: DataTablePaginationProps<TData>) {
  // Get the current pagination state from the table
  const { pageIndex, pageSize } = table.getState().pagination;

  // Calculate the starting and ending item numbers for the current page
  const firstItem = pageIndex * pageSize + 1;
  const lastItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* Display the new, more informative pagination text */}
        Showing {firstItem} to {lastItem} of {totalCount} products
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}