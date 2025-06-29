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
} from '@tanstack/react-table';
import { DataTableViewOptions } from './data-table-view-options';
import { PageHeader } from "@/components/shared/page-header";

// --- MOCK API CALLS ---
async function updateProductApi(product: Product): Promise<{ success: boolean }> {
  console.log("Updating product:", product.id);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}

async function deleteProductApi(productId: string): Promise<{ success: boolean }> {
  console.log("Deleting product:", productId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (productId === "prod_fail") return { success: false };
  return { success: true };
}

function duplicateProductApi(originalProduct: Product): Promise<Product> {
  console.log("Duplicating product:", originalProduct.id);
  return new Promise<Product>((resolve, reject) => {
    setTimeout(() => {
      if (originalProduct.name.includes("Fail")) {
        reject(new Error("Failed to duplicate product."));
        return;
      }
      const duplicatedProduct: Product = { ...originalProduct, id: `prod_copy_${Date.now()}`, name: `${originalProduct.name} (Copy)`, isActive: false };
      resolve(duplicatedProduct);
    }, 1000);
  });
}

async function createProductApi(newProductData: Omit<Product, "id" | "createdAt">): Promise<Product> {
  console.log("Creating new product with name:", newProductData.name);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newProduct: Product = {
    id: `prod_new_${Date.now()}`,
    createdAt: new Date().toISOString(),
    isFeatured: false,
    images: [{ id: "img_new", url: "https://picsum.photos/seed/new/400/400" }],
    name: newProductData.name || "New Product",
    price: newProductData.price || 0,
    inventoryQuantity: newProductData.inventoryQuantity || 0,
    isActive: newProductData.isActive || false,
  };
  return newProduct;
}

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductsView({ initialProducts }: ProductListProps) {
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
  const selectedProductIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);
  const numSelected = selectedProductIds.length;

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
    await deleteProductApi(productToDelete.id);
    setProducts((current) => current.filter((p) => p.id !== productToDelete.id));
    toast.success(`Product "${productToDelete.name}" has been deleted.`);
    setIsDeletePending(false);
    setProductToDelete(null);
  };

  const handleSaveChanges = async (productData: Partial<Product>) => {
    setIsEditPending(true);
    if (productData.id) {
      await updateProductApi(productData as Product);
      setProducts((current) => current.map((p) => (p.id === productData.id ? (productData as Product) : p)));
      toast.success(`Product "${productData.name}" has been updated.`);
      setProductToEdit(null);
    } else {
      const newProduct = await createProductApi(productData as Omit<Product, "id" | "createdAt">);
      setProducts((current) => [newProduct, ...current]);
      toast.success(`Product "${newProduct.name}" has been created.`);
      setIsAddSheetOpen(false);
    }
    setIsEditPending(false);
  };

  const handleDuplicateProduct = (productToDuplicate: Product) => {
    toast.promise(duplicateProductApi(productToDuplicate), {
      loading: `Duplicating "${productToDuplicate.name}"...`,
      success: (newProduct) => {
        setProducts((current) => [newProduct, ...current]);
        return `Product "${productToDuplicate.name}" has been duplicated.`;
      },
      error: (err) => err.message || "Failed to duplicate product.",
    });
  };

  const handleBulkDelete = async () => {
    setIsBulkDeletePending(true);
    await Promise.all(selectedProductIds.map((id) => deleteProductApi(id)));
    setProducts((current) => current.filter((p) => !selectedProductIds.includes(p.id)));
    toast.success(`${numSelected} product(s) deleted successfully.`);
    setIsBulkDeletePending(false);
    setRowSelection({});
    setIsBulkDeleteDialogOpen(false);
  };

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      openDeleteDialog,
      openEditSheet,
      handleDuplicateProduct,
    },
  });

  return (
    <div>
      <PageHeader title="Products" description="Manage all products for your store.">
        <Button onClick={openAddSheet}>Add Product</Button>
      </PageHeader>

      <DataTableViewOptions table={table} />
      
      <DataTable table={table} />

      <div
        className={`fixed inset-x-4 bottom-4 z-50 transition-transform duration-300 ease-in-out ${numSelected > 0 ? 'translate-y-0' : 'translate-y-24'}`}
      >
        {numSelected > 0 && (
          <div className="mx-auto flex h-14 w-fit max-w-full items-center justify-between gap-8 rounded-full border bg-background/95 px-6 shadow-2xl backdrop-blur-sm">
            <div className="text-sm font-medium"><span className="font-semibold">{numSelected}</span> selected</div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <DeleteProductDialog isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={handleConfirmDelete} productName={productToDelete?.name || ""} isPending={isDeletePending} />
      <EditProductSheet isOpen={!!productToEdit || isAddSheetOpen} onClose={() => { setProductToEdit(null); setIsAddSheetOpen(false); }} product={productToEdit} onSave={handleSaveChanges} isPending={isEditPending} />
      <BulkDeleteAlertDialog isOpen={isBulkDeleteDialogOpen} onClose={() => setIsBulkDeleteDialogOpen(false)} onConfirm={handleBulkDelete} selectedCount={numSelected} isPending={isBulkDeletePending} />
    </div>
  );
}