"use client";

import React, { useState } from "react";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "./columns";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { Review } from "@/types/reviews";
import { useReviews } from "@/hooks/use-reviews"; // Our unified hook

// UI Components
import { DeleteReviewDialog } from "./delete-review-dialog"; // We'll create this next
import { ReviewsTableViewOptions } from "./data-table-view-options";
import { DataTablePagination } from "@/components/shared/data-table-footer";
import { ReviewTableMeta } from "@/types/table-meta";

export function ReviewsWrapper() {
  // --- Unified Data Hook ---
  // Managed state (page, search) and isolation (tenantId) are handled inside
  const {
    reviews,
    meta,
    isLoading,
    isFetching,
    isError,
    page,
    setPage,
    setSearch,
    deleteReview,
    isDeleting,
  } = useReviews(10);

  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- Modal UI State ---
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // --- Table Meta Configuration ---
  // Passes handlers to the columns/actions without prop drilling
  const tableMeta: ReviewTableMeta<Review> = {
    openDeleteDialog: (review) => setReviewToDelete(review),
  };

  const table = useReactTable({
    data: reviews,
    columns,
    pageCount: meta?.totalPages || 1,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize: 10 },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: tableMeta,
  });

  const selectedReviewIds = Object.keys(rowSelection);
  const numSelected = selectedReviewIds.length;

  // --- Render Logic ---
  if (isLoading) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Error loading reviews.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader 
          title="Product Reviews" 
          description="Moderate and monitor customer feedback for your store."
        />

        <div className="px-4 md:px-2 lg:px-4 md:pb-10">
          <ReviewsTableViewOptions table={table} />
          <DataTable table={table} />
        </div>
      </div>
      
      {/* Centralized Pagination */}
      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      {/* Bulk Action Bar (Scale Ready) */}
      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 rounded-lg bg-background p-4 shadow-lg border flex items-center justify-between">
          <div className="text-sm font-medium">{numSelected} reviews selected</div>
          {/* Implement bulk delete logic here if needed */}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteReviewDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={() => {
          if (reviewToDelete) {
            deleteReview(reviewToDelete.id, {
              onSuccess: () => setReviewToDelete(null),
            });
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
}