"use client";

import { Table as TanstackTable } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  totalCount: number;
}

export function DataTablePagination<TData>({
  table,
  totalCount,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = Math.ceil(totalCount / pageSize);

  const firstItem = Math.min(pageIndex * pageSize + 1, totalCount);
  const lastItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  const showPagination = totalCount > 0 && firstItem <= totalCount;

  if (!showPagination) return null;

  // Helper to go to a specific page
  const goToPage = (page: number) => {
    table.setPageIndex(page);
  };

  // Create visible page numbers (you can make this smarter later)
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i).slice(
    Math.max(0, pageIndex - 2),
    Math.min(totalPages, pageIndex + 3)
  );

  return (
    <div className="bg-white rounded-md border py-2 px-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 whitespace-nowrap w-full">
        {/* Left side text */}
        <div className="text-sm text-muted-foreground">
          Showing {firstItem} to {lastItem} of {totalCount} products
        </div>
        {/* Pagination controls */}
        <Pagination className="ml-auto mx-0 justify-end">
          <PaginationContent className="flex-wrap justify-end">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {visiblePages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === pageIndex}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page);
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageIndex + 3 < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
