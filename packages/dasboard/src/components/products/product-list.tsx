// src/components/dashboard/products/product-list.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types/products';
import { DataTable } from '@/components/shared/data-table';
import { columns } from '@/app/dashboard/products/columns';
import { EditProductSheet } from './edit-product-sheet';
import { DeleteProductDialog } from './delete-product-dialog';
import { toast } from 'sonner';

// --- MOCK API CALLS ---
async function updateProductApi(product: Product): Promise<{ success: boolean }> {
  console.log(`Attempting to update product:`, product);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Product updated successfully.");
  return { success: true };
}

async function deleteProductApi(productId: string): Promise<{ success: boolean }> {
  console.log(`Attempting to delete product with ID: ${productId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate a potential failure
  if (productId === 'prod_fail') { // Use a specific ID to test failure
    console.error("Failed to delete product.");
    return { success: false };
  }
  console.log("Product deleted successfully.");
  return { success: true };
}

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  // const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // <-- 2. Add state for editing
  const [isEditPending, setIsEditPending] = useState(false); // <-- 2. Add pending state for editing

   const openDeleteDialog = (product: Product) => setProductToDelete(product);
   const openEditSheet = (product: Product) => setProductToEdit(product);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeletePending(true);
    const { success } = await deleteProductApi(productToDelete.id);
    setIsDeletePending(false);

    if (success) {
      // On success, remove the product from the client-side state for instant UI update
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== productToDelete.id)
      );
      toast(`Success! Product "${productToDelete.name}" has been deleted.`);
    } else {
      toast("Error: Failed to delete the product. Please try again.");
    }

    setProductToDelete(null); // Close the dialog
  };

    // 4. Add handler for saving changes from the sheet
  const handleSaveChanges = async (updatedProduct: Product) => {
    setIsEditPending(true);
    const { success } = await updateProductApi(updatedProduct);
    setIsEditPending(false);

    if (success) {
      setProducts(currentProducts => 
        currentProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      toast.success(`Product "${updatedProduct.name}" has been updated.`);
      setProductToEdit(null); // Close the sheet
    } else {
       toast.error("Failed to update the product. Please try again.");
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        filterColumn="name"
        // Pass our action handler function to the table via the `meta` prop
        meta={{
          openDeleteDialog,
          openEditSheet,
        }}
      />
      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ''}
        isPending={isDeletePending}
      />
       <EditProductSheet
        isOpen={!!productToEdit}
        onClose={() => setProductToEdit(null)}
        product={productToEdit}
        onSave={handleSaveChanges}
        isPending={isEditPending}
      />
    </>
  );
}