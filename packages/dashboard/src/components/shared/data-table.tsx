"use client";

import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { DataTablePagination } from "./data-table-footer";

// --- The Main DataTable Component ---
// This component is now a "dumb" renderer.
// It receives the table instance from a parent component.
interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  totalCount: number;
}

export function DataTable<TData>({ table, totalCount }: DataTableProps<TData>) {
  return (
    <div>
      {/* Table */}
      <div className="rounded-md border bg-[#fff]">
        <Table className="text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                  data-testid="products-empty-state"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} totalCount={totalCount} />
    </div>
  );
}

export function DataTableSkeleton() {
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center gap-4 pb-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        {/* Page Header Skeleton */}
        <div className="flex items-center gap-4 py-4">
          <Skeleton className="h-20 w-full" />
        </div>
        {/* Table Skeleton */}
        <div className="rounded-md border bg-[#fff]">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-8 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="bg-[#fff] rounded-md border flex items-center justify-end space-x-2 py-2 px-2">
          <div className="flex-1 px-2">
            <Skeleton className="h-10 w-72" />
          </div>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </>
  );
}
