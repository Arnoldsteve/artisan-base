"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/products";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "@/app/dashboard/products/columns";
import { EditProductSheet } from "./edit-product-sheet";
import { DeleteProductDialog } from "./delete-product-dialog";
import { BulkDeleteAlertDialog } from "./bulk-delete-alert-dialog";
import { toast } from "sonner";
import { Button } from "@repo/ui";
import { Trash2 } from "lucide-react";
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
import { DataTableViewOptions } from "./data-table-view-options";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/api";
import { CreateProductDto, UpdateProductDto } from "@/types/products.dto";
import { useDebounce } from "@/hooks/use-debounce";
import { productService } from "@/services/product-service";

// Helper function to create a URL-friendly slug from a string
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

interface ProductsViewProps {
  initialProducts: Product[];
}

export function ProductsView({ initialProducts }: ProductsViewProps) {
  // Data State
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Table State
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // UI State for Modals/Sheets
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditPending, setIsEditPending] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);

  // Derived State
  const selectedProductIds = useMemo(() => {
    const selectedRows = Object.keys(rowSelection).map(
      (index) => products[parseInt(index, 10)]
    );
    return selectedRows.map((row) => row.id);
  }, [rowSelection, products]);
  const numSelected = selectedProductIds.length;

  // Debounced name filter for search
  const nameFilter =
    (columnFilters.find((f) => f.id === "name")?.value as string) ?? "";
  const debouncedNameFilter = useDebounce(nameFilter, 300);

  React.useEffect(() => {
    // Only search if filter is not empty
    if (debouncedNameFilter) {
      productService
        .searchProducts(debouncedNameFilter)
        .then(setProducts)
        .catch(() => setProducts([]));
    } else {
      setProducts(initialProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameFilter]);

  // Action Handlers
  const openDeleteDialog = (product: Product) => setProductToDelete(product);
  const openEditSheet = (product: Product) => setProductToEdit(product);
  const openAddSheet = () => {
    setProductToEdit(null);
    setIsAddSheetOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeletePending(true);
    try {
      await api.products.deleteProduct(productToDelete.id);
      setProducts((current) =>
        current.filter((p) => p.id !== productToDelete.id)
      );
      toast.success(`Product "${productToDelete.name}" has been deleted.`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeletePending(false);
      setProductToDelete(null);
    }
  };

  const handleSaveChanges = async (productData: Partial<Product>) => {
    setIsEditPending(true);
    try {
      if (productData.id) {
        // Update existing product
        const updateDto: UpdateProductDto = {
          name: productData.name,
          price: productData.price,
          inventoryQuantity: productData.inventoryQuantity,
          description: productData.description,
          isFeatured: productData.isFeatured,
          slug: productData.name ? slugify(productData.name) : undefined,
        };
        const updatedProduct = await api.products.updateProduct(
          productData.id,
          updateDto
        );
        setProducts((current) =>
          current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        toast.success(`Product "${updatedProduct.name}" has been updated.`);
        setProductToEdit(null);
      } else {
        // Create new product
        if (!productData.name) throw new Error("Product name is required.");
        const createDto: CreateProductDto = {
          name: productData.name,
          slug: slugify(productData.name),
          price: productData.price || 0,
          inventoryQuantity: productData.inventoryQuantity || 0,
          description: productData.description || "",
          isFeatured: productData.isFeatured || false,
        };
        const newProduct = await api.products.createProduct(createDto);
        setProducts((current) => [newProduct, ...current]);
        toast.success(`Product "${newProduct.name}" has been created.`);
        setIsAddSheetOpen(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsEditPending(false);
    }
  };

  const handleDuplicateProduct = (productToDuplicate: Product) => {
    const newName = `${productToDuplicate.name} (Copy)`;
    const createDto: CreateProductDto = {
      name: newName,
      slug: slugify(newName),
      price: productToDuplicate.price,
      inventoryQuantity: productToDuplicate.inventoryQuantity,
      description: productToDuplicate.description,
      isFeatured: false,
    };

    toast.promise(api.products.createProduct(createDto), {
      loading: `Duplicating "${productToDuplicate.name}"...`,
      success: (newProduct) => {
        setProducts((current) => [newProduct, ...current]);
        return `Product has been duplicated.`;
      },
      error: (err) => (err as Error).message,
    });
  };

  const handleBulkDelete = async () => {
    setIsBulkDeletePending(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) => api.products.deleteProduct(id))
      );
      setProducts((current) =>
        current.filter((p) => !selectedProductIds.includes(p.id))
      );
      toast.success(`${numSelected} product(s) deleted successfully.`);
      setRowSelection({});
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsBulkDeletePending(false);
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const table = useReactTable({
    data: products,
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

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage all products for your store."
      >
        <Button onClick={openAddSheet}>Add Product</Button>
      </PageHeader>
      <DataTableViewOptions table={table} />
      <DataTable table={table} />
      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? "translate-y-0" : "translate-y-24"}`}
      >
        {numSelected > 0 && (
          <div className="mx-auto flex h-14 w-fit max-w-full items-center justify-between gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
            <div className="text-sm font-medium">
              <span className="font-semibold">{numSelected}</span> selected
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ""}
        isPending={isDeletePending}
      />
      <EditProductSheet
        isOpen={!!productToEdit || isAddSheetOpen}
        onClose={() => {
          setProductToEdit(null);
          setIsAddSheetOpen(false);
        }}
        product={productToEdit}
        onSave={handleSaveChanges}
        isPending={isEditPending}
      />
      <BulkDeleteAlertDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        selectedCount={numSelected}
        isPending={isBulkDeletePending}
      />
    </div>
  );
}
