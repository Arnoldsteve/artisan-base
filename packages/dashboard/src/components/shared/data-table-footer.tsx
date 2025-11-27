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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOTS, usePaginationRange } from "@/hooks/use-pagination-range";

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  totalCount: number;
}

export function DataTablePagination<TData>({
  table,
  totalCount,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = table.getPageCount();

  const firstItem = Math.min(pageIndex * pageSize + 1, totalCount);
  const lastItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  // Use the new smart pagination hook
  const paginationRange = usePaginationRange({
    totalCount,
    pageSize,
    currentPage: pageIndex + 1, // The hook is 1-based, tanstack table is 0-based
  });

  const showPagination = totalCount > pageSize;

  return (
    <div className="sticky bottom-0 bg-white rounded-md border py-1 px-4 w-full mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* Left side: Item count and rows per page selector */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">
            {totalCount > 0
              ? `Showing ${firstItem} to ${lastItem} of ${totalCount} products`
              : "No products"}
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right side: Pagination controls */}
        {showPagination && (
          <Pagination className="ml-auto mx-0 w-auto justify-end">
            <PaginationContent>
              {/* Go to First Page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(0);
                  }}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                >
                  First
                </PaginationLink>
              </PaginationItem>
              
              {/* Previous Page */}
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

              {/* Page Numbers */}
              {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return (
                    <PaginationItem key={`dots-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageIndex + 1 === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex((pageNumber as number) - 1);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next Page */}
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

              {/* Go to Last Page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(totalPages - 1);
                  }}
                  aria-disabled={!table.getCanNextPage()}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                >
                  Last
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}