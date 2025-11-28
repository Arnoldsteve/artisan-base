"use client";

import React, { useState, useMemo } from "react";
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
  PaginationState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { Category } from "@/types/categories";
import { EditCategorySheet } from "./edit-category-sheet";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import {
  useCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import { DataTableViewOptions } from "./data-table-view-options";
import { PaginatedResponse } from "@/types/shared";
import { CategoryTableMeta } from "@/types/table-meta";
import { DataTablePagination } from "@/components/shared/data-table-footer";

interface CategoriesWrapperProps {
  initialCategoryData: PaginatedResponse<
    Category & { _count?: { products: number } }
  >;
}

export function CategoriesWrapper({
  initialCategoryData,
}: CategoriesWrapperProps) {
  // --- Table State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- UI State for Modals/Sheets ---
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // --- Data Fetching & Mutations ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    isFetching,
  } = useCategories(pageIndex + 1, pageSize, "", initialCategoryData);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // --- Memoized Data ---
  const categories = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );
  const totalCategories = paginatedResponse?.meta?.total ?? 0;
  const selectedCategoryIds = useMemo(
    () => Object.keys(rowSelection),
    [rowSelection]
  );
  const numSelected = selectedCategoryIds.length;

  // --- Action Handlers ---
  const openDeleteDialog = (
    category: Category & { _count?: { products: number } }
  ) => {
    // Convert back to base Category type for the delete dialog
    setCategoryToDelete(category as Category);
  };

  const openEditSheet = (
    category: Category & { _count?: { products: number } }
  ) => {
    // Convert back to base Category type for the edit sheet
    setCategoryToEdit(category as Category);
    setIsSheetOpen(true);
  };

  const openAddSheet = () => {
    setCategoryToEdit(null);
    setIsSheetOpen(true);
  };

  // --- Create the meta object with proper typing ---
  const tableMeta: CategoryTableMeta<
    Category & { _count?: { products: number } }
  > = {
    openDeleteDialog,
    openEditSheet,
  };

  // --- Table Instance Initialization ---
  const table = useReactTable({
    data: categories,
    columns,
    pageCount: paginatedResponse?.meta?.totalPages ?? -1,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: tableMeta,
  });

  // --- Mutation Handlers ---
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id, {
        onSuccess: () => setCategoryToDelete(null),
      });
    }
  };

  const handleSaveChanges = (formData: {
    id?: string;
    name: string;
    description?: string;
  }) => {
    const categoryData = {
      name: formData.name,
      description: formData.description || "",
    };

    if (formData.id) {
      updateCategory(
        { id: formData.id, data: categoryData },
        {
          onSuccess: () => setIsSheetOpen(false),
        }
      );
    } else {
      createCategory(categoryData, {
        onSuccess: () => setIsSheetOpen(false),
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
        return `${numSelected} categories deleted.`;
      },
      error: "Failed to delete one or more categories.",
    });
  };

  // --- Render Logic ---
  if (isFetching || (isLoading && !initialCategoryData)) {
    return <DataTableSkeleton />;
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500">Failed to load categories data.</div>
    );
  }

  return (
    <div>
      <PageHeader title="Product Categories">
        <Button variant={"outline"} size={"sm"} onClick={openAddSheet}>
          Add Category
        </Button>
      </PageHeader>

      <div className="px-4 md:px-2 lg:px-4 md:mt-0 md:pb-10">
        <DataTableViewOptions table={table} />
        <DataTable table={table} />
      </div>
      <DataTablePagination table={table} totalCount={totalCategories} />

      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 rounded-lg bg-background p-4 shadow-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm">{numSelected} category(ies) selected.</div>
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <DeleteCategoryDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
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

      {/* <BulkDeleteCategoriesDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        selectedCount={numSelected}
        isPending={isDeleting}
      /> */}
    </div>
  );
}
