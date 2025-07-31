"use client";

import React, { useState, useMemo } from "react";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "../columns"; // Corrected path
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/page-header";
import { Product, PaginatedResponse, UpdateProductDto, CreateProductDto } from "@/types/products";
import {
  useProducts,
  useDeleteProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/use-products";

// UI Components
import { EditProductSheet } from "./edit-product-sheet";
import { DeleteProductDialog } from "./delete-product-dialog";
import { BulkDeleteAlertDialog } from "./bulk-delete-alert-dialog";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Helper function (can be moved to a utils file)
const slugify = (text: string) => text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");

interface ProductsViewProps {
  initialData: PaginatedResponse<Product>;
}

export function ProductsView({ initialData }: ProductsViewProps) {
  // --- Table State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // --- UI State for Modals/Sheets ---
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // --- Data Fetching & Mutations with TanStack Query ---
  const { data: paginatedResponse, isLoading, isError } = useProducts(1, 10, "", initialData);
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // --- Memoized Data ---
  // The raw `products` array from the API response
  const products = useMemo(() => paginatedResponse?.data || [], [paginatedResponse]);
  const selectedProductIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);
  const numSelected = selectedProductIds.length;

  // --- Action Handlers ---
  const openDeleteDialog = (product: Product) => setProductToDelete(product);
  const openEditSheet = (product: Product) => {
    setProductToEdit(product);
    setIsSheetOpen(true);
  };
  const openAddSheet = () => {
    setProductToEdit(null); // Set to null for creation
    setIsSheetOpen(true);
  };
  const handleDuplicateProduct = (productToDuplicate: Product) => {
    const newName = `${productToDuplicate.name} (Copy)`;
    createProduct({
      name: newName,
      slug: slugify(newName),
      price: productToDuplicate.price.toNumber(), // Convert Decimal to number for DTO
      inventoryQuantity: productToDuplicate.inventoryQuantity,
      isFeatured: false,
    });
  };

  // --- Table Instance Initialization ---
  const table = useReactTable({
    data: products, // Use the raw products array
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { openDeleteDialog, openEditSheet, handleDuplicateProduct },
  });

  // --- Mutation Handlers ---
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => setProductToDelete(null),
      });
    }
  };
  const handleSaveChanges = (formData: UpdateProductDto & { id?: string }) => {
    const dataToSave = { ...formData, slug: slugify(formData.name || '') };
    if (dataToSave.id) {
      updateProduct({ id: dataToSave.id, data: dataToSave }, {
        onSuccess: () => setIsSheetOpen(false),
      });
    } else {
      createProduct(dataToSave as CreateProductDto, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };
  const handleBulkDelete = () => {
    // Note: This would be better as a single API call, but for now we loop.
    const promises = selectedProductIds.map(id => deleteProduct(id));
    toast.promise(Promise.all(promises), {
        loading: `Deleting ${numSelected} products...`,
        success: () => {
            setRowSelection({}); // Clear selection on success
            setIsBulkDeleteDialogOpen(false);
            return `${numSelected} products deleted.`;
        },
        error: "Failed to delete one or more products."
    });
  };

  // --- Render Logic ---
  if (isLoading && !paginatedResponse) {
    return <DataTableSkeleton />;
  }
  if (isError) {
    return <div className="p-8 text-red-500">Failed to load product data.</div>;
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage all products for your store.">
        <Button onClick={openAddSheet}>Add Product</Button>
      </PageHeader>
      
      <DataTableViewOptions table={table} />
      <DataTable table={table} />
      
      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 ...">
            {/* Bulk Action Bar JSX */}
        </div>
      )}

      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ""}
        isPending={isDeleting}
      />
      <EditProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={productToEdit}
        onSave={handleSaveChanges}
        isPending={isCreating || isUpdating}
      />
      <BulkDeleteAlertDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        selectedCount={numSelected}
        isPending={isDeleting} // Can reuse isDeleting for bulk as well
      />
    </div>
  );
}