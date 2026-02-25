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
import { Category, CreateCategoryDto } from "@/types/categories";
import { useCategories } from "@/hooks/use-categories"; // Single hook import

// UI Components
import { EditCategorySheet } from "./edit-category-sheet";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { CategoryTableMeta } from "@/types/table-meta";
import { DataTablePagination } from "@/components/shared/data-table-footer";

export function CategoriesWrapper() {
  // --- Unified Data Hook ---
  const {
    categories,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    setSearch,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
  } = useCategories(10);

  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- Modal UI State ---
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // --- Table Meta Configuration ---
  const tableMeta: CategoryTableMeta<Category & { _count?: { products: number } }> = {
    openDeleteDialog: (cat) => setCategoryToDelete(cat as Category),
    openEditSheet: (cat) => {
      setCategoryToEdit(cat as Category);
      setIsSheetOpen(true);
    },
  };

  const table = useReactTable({
    data: categories,
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

  const selectedCategoryIds = Object.keys(rowSelection);
  const numSelected = selectedCategoryIds.length;

  const handleSaveChanges = (formData: any) => {
    if (formData.id) {
      updateCategory({ id: formData.id, data: formData }, {
        onSuccess: () => setIsSheetOpen(false)
      });
    } else {
      createCategory(formData, {
        onSuccess: () => setIsSheetOpen(false)
      });
    }
  };

  const handleBulkDelete = () => {
    const promises = selectedCategoryIds.map((id) => deleteCategory(id));
    toast.promise(Promise.all(promises), {
      loading: `Deleting ${numSelected} categories...`,
      success: () => {
        setRowSelection({});
        setIsBulkDeleteDialogOpen(false);
        return "Categories deleted successfully.";
      },
      error: "Failed to delete categories.",
    });
  };

  if (isLoading) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Failed to load categories.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Product Categories">
          <Button variant="outline" size="sm" onClick={() => { setCategoryToEdit(null); setIsSheetOpen(true); }}>
            Add Category
          </Button>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:pb-10">
          <DataTable table={table} />
        </div>
      </div>

      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 rounded-lg bg-background p-4 shadow-lg border flex items-center justify-between">
          <div className="text-sm font-medium">{numSelected} categories selected</div>
          <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteDialogOpen(true)}>
            Delete Selected
          </Button>
        </div>
      )}

      <DeleteCategoryDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => deleteCategory(categoryToDelete!.id, { onSuccess: () => setCategoryToDelete(null) })}
        categoryName={categoryToDelete?.name || ""}
        isPending={isDeleting}
      />

      <EditCategorySheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        category={categoryToEdit}
        onSave={handleSaveChanges}
        isPending={isCreating || isUpdating}
      />
    </div>
  );
}