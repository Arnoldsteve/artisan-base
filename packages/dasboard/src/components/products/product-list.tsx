'use client';

import { useState } from 'react';
import { Product } from '@/types/products';
import { DataTable } from '@/components/shared/data-table';
import { columns } from '@/app/dashboard/products/columns';
import { EditProductSheet } from './edit-product-sheet';
import { DeleteProductDialog } from './delete-product-dialog';
import { toast } from 'sonner';
import { PageHeader } from '../shared/page-header';
import { Button } from '@repo/ui';

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

function duplicateProductApi(originalProduct: Product): Promise<Product> {
  console.log(`Attempting to duplicate product: ${originalProduct.name}`);
  
  const promise = new Promise<Product>((resolve, reject) => {
    setTimeout(() => {
      // Simulate potential failure
      if (originalProduct.name.includes('Fail')) {
        reject(new Error('Failed to duplicate product in the backend.'));
        return;
      }
      
      // Create the new product object
      const duplicatedProduct: Product = {
        ...originalProduct,
        id: `prod_copy_${Date.now()}`, // Create a new unique ID
        name: `${originalProduct.name} (Copy)`, // Append (Copy) to the name
        isActive: false, // Set the new product as a draft by default
      };
      
      console.log("Product duplicated successfully.", duplicatedProduct);
      resolve(duplicatedProduct);
    }, 1000); // 1-second delay
  });

  return promise;
}

async function createProductApi(newProductData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  console.log(`Attempting to create product:`, newProductData);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newProduct: Product = {
    id: `prod_new_${Date.now()}`,
    createdAt: new Date().toISOString(),
    isFeatured: false,
    images: [{ id: 'img_new', url: 'https://picsum.photos/seed/new/400/400' }],
    // Important: Use sane defaults if fields are missing
    name: newProductData.name || "New Product",
    price: newProductData.price || 0,
    inventoryQuantity: newProductData.inventoryQuantity || 0,
    isActive: newProductData.isActive || false,
  };
  console.log("Product created successfully.", newProduct);
  return newProduct;
}


interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
   const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); 
  const [isEditPending, setIsEditPending] = useState(false); 
  
  // 2. CONFIRM THIS STATE EXISTS
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const openDeleteDialog = (product: Product) => setProductToDelete(product);
  const openEditSheet = (product: Product) => setProductToEdit(product);
  const openAddSheet = () => {
    setProductToEdit(null); 
    setIsAddSheetOpen(true);
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

  const handleSaveChanges = async (productData: Partial<Product>) => {
    setIsEditPending(true);
    if (productData.id) {
      const { success } = await updateProductApi(productData as Product);
      if (success) {
        setProducts(current => current.map(p => (p.id === productData.id ? (productData as Product) : p)));
        toast.success(`Product "${productData.name}" has been updated.`);
        setProductToEdit(null);
      } else {
        toast.error("Failed to update product.");
      }
    } else {
      const newProduct = await createProductApi(productData as Omit<Product, 'id' | 'createdAt'>);
      setProducts(current => [newProduct, ...current]);
      toast.success(`Product "${newProduct.name}" has been created.`);
      setIsAddSheetOpen(false);
    }
    setIsEditPending(false);
  };
 
  const handleDuplicateProduct = async (productToDuplicate: Product) => {
    toast.promise(duplicateProductApi(productToDuplicate), {
      loading: `Duplicating "${productToDuplicate.name}"...`,
      success: (newProduct) => {
        // On success, add the new product to the top of our list
        setProducts((currentProducts) => [newProduct, ...currentProducts]);
        return `Product "${productToDuplicate.name}" has been duplicated.`;
      },
      error: (err) => err.message || 'Failed to duplicate product.',
    });
  };



  return (
    <>
     <PageHeader title="Products" description="Manage all products for your store.">
         <Button onClick={openAddSheet}>Add Product</Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={products}
        filterColumn="name"
        // Pass our action handler function to the table via the `meta` prop
        meta={{
          openDeleteDialog,
          openEditSheet,
          handleDuplicateProduct,
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
        isOpen={!!productToEdit || isAddSheetOpen} 
        onClose={() => {
          setProductToEdit(null);     
          setIsAddSheetOpen(false);
        }}
        product={productToEdit} 
        onSave={handleSaveChanges}
        isPending={isEditPending}
      />
    </>
  );
}