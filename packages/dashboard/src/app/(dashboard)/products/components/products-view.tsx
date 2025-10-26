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
import { CreateProductDto, Product } from "@/types/products";
import {
  useCreateProduct,
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-products";

// UI Components
import { EditProductSheet } from "./edit-product-sheet";
import { DeleteProductDialog } from "./delete-product-dialog";
import { BulkDeleteAlertDialog } from "./bulk-delete-alert-dialog";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@repo/ui";
import { toast } from "sonner";
import { ProductFormData } from "@/validation-schemas/products";
import { ImageUploadDialog } from "./image-upload-dialog";
import { CategoryAssignmentSheet } from "./category-assignment-sheet";
import { PaginatedResponse } from "@/types/shared";
import { ImagePreviewDialog } from "./image-preview-dialog";
import { slugify } from "@/utils/slugify";
import { ProductTableMeta } from "@/types/table-meta";

interface ProductsViewProps {
  initialProductData: PaginatedResponse<Product>;
}

export function ProductsView({ initialProductData }: ProductsViewProps) {
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
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const [productForImageUpload, setProductForImageUpload] =
    useState<Product | null>(null);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);

  const [productForCategory, setProductForCategory] = useState<Product | null>(
    null
  );
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const [productForPreview, setProductForPreview] = useState<Product | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- Data Fetching & Mutations ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    isFetching,
  } = useProducts(pageIndex + 1 , pageSize, "", initialProductData);

  // console.log("product data from product view: ", paginatedResponse);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // --- Memoized Data ---
  const products = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );
  const totalProducts = paginatedResponse?.meta?.total ?? 0;

  const selectedProductIds = useMemo(
    () => Object.keys(rowSelection),
    [rowSelection]
  );
  const numSelected = selectedProductIds.length;

  // --- Action Handlers ---
  const openDeleteDialog = (product: Product) => setProductToDelete(product);

  const openEditSheet = (product: Product) => {
    setProductToEdit(product);
    setIsSheetOpen(true);
  };
  const openAddSheet = () => {
    setProductToEdit(null);
    setIsSheetOpen(true);
  };
  const handleCategoryChange = (product: Product) => {
    setProductForCategory(product);
    setIsCategorySheetOpen(true);
  };
  const handleImageUpload = (product: Product) => {
    setProductForImageUpload(product);
    setIsImageUploadOpen(true);
  };
  const openImagePreview = (product: Product) => {
    setProductForPreview(product);
    setIsPreviewOpen(true);
  };

  const handleDuplicateProduct = (productToDuplicate: Product) => {
    const newName = `${productToDuplicate.name} (Copy)`;
    createProduct({
      name: newName,
      slug: slugify(newName),
      price: productToDuplicate.price.toNumber(),
      inventoryQuantity: productToDuplicate.inventoryQuantity,
      isFeatured: false,
    });
  };

  const tableMeta: ProductTableMeta<Product> = {
    openDeleteDialog,
    openEditSheet,
    handleDuplicateProduct,
    handleImageUpload,
    handleCategoryChange,
    openImagePreview,
    // isFetching,
  };

  const table = useReactTable({
    data: products,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalProducts > 0 ? Math.ceil(totalProducts / pageSize) : 1),
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
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => setProductToDelete(null),
      });
    }
  };

  const handleSaveChanges = (formData: ProductFormData) => {
    if (formData.id) {
      // update product → can be partial
      const { id, ...updateData } = formData;
      updateProduct(
        { id, data: updateData },
        {
          onSuccess: () => setIsSheetOpen(false),
        }
      );
    } else {
      // create product → must match CreateProductDto
      const { id, ...createData } = formData;
      createProduct(createData as CreateProductDto, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };

  const handleBulkDelete = () => {
    const promises = selectedProductIds.map((id) => deleteProduct(id));
    toast.promise(Promise.all(promises), {
      loading: `Deleting ${numSelected} products...`,
      success: () => {
        setRowSelection({});
        setIsBulkDeleteDialogOpen(false);
        return `${numSelected} products deleted.`;
      },
      error: "Failed to delete one or more products.",
    });
  };

 if (isFetching || (isLoading && !initialProductData)) {
  return <DataTableSkeleton />;
}

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load product data.</div>;
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage all products for your store."
      >
        <Button onClick={openAddSheet}>Add Product</Button>
      </PageHeader>

      <DataTableViewOptions table={table} />

      <DataTable table={table} totalCount={totalProducts} />

      {numSelected > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-50 rounded-lg bg-background p-4 shadow-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm">{numSelected} product(s) selected.</div>
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
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
        isPending={isDeleting}
      />
      <ImageUploadDialog
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        product={productForImageUpload}
      />

      <CategoryAssignmentSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        product={productForCategory}
      />

      <ImagePreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        product={productForPreview}
      />
    </div>
  );
}
