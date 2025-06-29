// src/components/dashboard/products/product-list.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types/products';
import { DataTable } from '@/components/shared/data-table';
import { columns } from '@/app/dashboard/products/columns';
import { DeleteProductDialog } from './delete-product-dialog';
// import { useToast } from '@repo/ui/use-toast'; // Assuming you have a toast component
import { toast } from 'sonner';

// A mock API call function
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

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
  };

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

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        filterColumn="name"
        // Pass our action handler function to the table via the `meta` prop
        meta={{
          openDeleteDialog,
        }}
      />
      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ''}
        isPending={isDeletePending}
      />
    </>
  );
}