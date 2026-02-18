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
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { CreateProductDto, Product } from "@/types/products";
import { useProducts } from "@/hooks/use-products"; // Single hook import

// UI Components
import { EditProductSheet } from "./edit-product-sheet";
import { DeleteProductDialog } from "./delete-product-dialog";
import { BulkDeleteAlertDialog } from "./bulk-delete-alert-dialog";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { ProductFormData } from "@/validation-schemas/products";
import { ImageUploadDialog } from "./image-upload-dialog";
import { CategoryAssignmentSheet } from "./category-assignment-sheet";
import { ImagePreviewDialog } from "./image-preview-dialog";
import { slugify } from "@/utils/slugify";
import { ProductTableMeta } from "@/types/table-meta";
import { BulkUploadDropdown } from "./bulk-upload-dropdown";
import { BulkProductRow, BulkUploadModal } from "./bulk-upload-preview-modal";
import { DataTablePagination } from "@/components/shared/data-table-footer";

export function ProductsWrapper() {
  // --- Unified Data Hook ---
  const {
    products,
    meta,
    isLoading,
    isFetching,
    isError,
    page,
    setPage,
    setSearch,
    createProduct,
    isCreating,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
    bulkCreate,
    isBulkCreating,
  } = useProducts(10);

  // --- Table UI State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- Modal UI State ---
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [productForImageUpload, setProductForImageUpload] = useState<Product | null>(null);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [productForCategory, setProductForCategory] = useState<Product | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [productForPreview, setProductForPreview] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // --- Handlers ---
  const handleDuplicateProduct = (p: Product) => {
    createProduct({
      ...p,
      name: `${p.name} (Copy)`,
      slug: slugify(`${p.name}-copy`),
      price: Number(p.price),
    });
  };

  const handleBulkImport = async (validRows: BulkProductRow[]) => {
    const cleanedRows: CreateProductDto[] = validRows.map((row) => ({
      name: row.name,
      slug: slugify(row.name),
      price: Number(row.price),
      sku: row.sku,
      inventoryQuantity: row.inventoryQuantity,
      isActive: row.isActive,
    }));
    bulkCreate(cleanedRows, {
      onSuccess: () => {
        setIsBulkModalOpen(false);
        setBulkFile(null);
      },
    });
  };

  const tableMeta: ProductTableMeta<Product> = {
    openDeleteDialog: setProductToDelete,
    openEditSheet: (p) => { setProductToEdit(p); setIsSheetOpen(true); },
    handleDuplicateProduct,
    handleImageUpload: (p) => { setProductForImageUpload(p); setIsImageUploadOpen(true); },
    handleCategoryChange: (p) => { setProductForCategory(p); setIsCategorySheetOpen(true); },
    openImagePreview: (p) => { setProductForPreview(p); setIsPreviewOpen(true); },
  };

  const table = useReactTable({
    data: products,
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

  const selectedProductIds = Object.keys(rowSelection);

  if (isLoading) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Error loading products.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Products">
          <BulkUploadDropdown onCsvImport={(f) => { setBulkFile(f); setIsBulkModalOpen(true); }} onExcelImport={(f) => { setBulkFile(f); setIsBulkModalOpen(true); }} />
          <Button variant="outline" size="sm" onClick={() => { setProductToEdit(null); setIsSheetOpen(true); }}>
            Add Product
          </Button>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:pb-10">
          <DataTableViewOptions table={table} />
          <DataTable table={table} />
        </div>
      </div>
      
      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => deleteProduct(productToDelete!.id, { onSuccess: () => setProductToDelete(null) })}
        productName={productToDelete?.name || ""}
        isPending={isDeleting}
      />
      
      <EditProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={productToEdit}
        onSave={(data) => {
          if (data.id) updateProduct({ id: data.id, data }, { onSuccess: () => setIsSheetOpen(false) });
          else createProduct(data as CreateProductDto, { onSuccess: () => setIsSheetOpen(false) });
        }}
        isPending={isCreating || isUpdating}
      />

      <BulkUploadModal file={bulkFile} isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} onConfirm={handleBulkImport} />
      {/* Other dialogs (Image, Category, Preview) follow same pattern... */}
    </div>
  );
}