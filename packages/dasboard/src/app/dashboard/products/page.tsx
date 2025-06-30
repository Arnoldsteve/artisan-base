'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductsView } from './components/products-view';
import { DataTableSkeleton } from '@/components/shared/data-table';
import { api } from '@/api';
import { Product } from '@/types/products';
import { toast } from 'sonner';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function runs once when the component mounts
    const fetchInitialProducts = async () => {
      try {
        // Call our new API function to get the first page of products
        const response = await api.products.getProducts();
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        toast.error((error as Error).message);
        // If the error is related to authentication, redirect to login
        if ((error as Error).message.includes('authenticated')) {
          router.replace('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialProducts();
  }, [router]); // Add router to the dependency array

  // While data is being fetched, show the skeleton loader
  if (isLoading) {
    return <DataTableSkeleton />;
  }

  // Once data is loaded, render the main view component
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <ProductsView initialProducts={products} />
    </div>
  );
}