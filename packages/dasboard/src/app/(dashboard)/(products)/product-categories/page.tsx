// File: packages/dasboard/src/app/(dashboard)/(products)/product-categories/page.tsx

import { createServerApiClient } from '@/lib/server-api';
import { CategoriesView } from './components/categories-view';
import { Category } from '@/types/category';
import { PaginatedResponse } from '@/types/products';

export default async function ProductCategoriesPage() {
  
  let initialData: PaginatedResponse<Category & { _count?: { products: number } }>;

  try {
    // Create server API client
    const serverApi = await createServerApiClient();

    // Fetch categories with product counts
    initialData = await serverApi.get<PaginatedResponse<Category & { _count?: { products: number } }>>(
      "/dashboard/categories", 
      { page: 1, limit: 10 }
    );
    console.log("Fetched initial categories on server:", initialData);

  } catch (err) {
    console.error("Failed to fetch initial categories on server:", err);
    initialData = { 
      data: [], 
      meta: { total: 0, page: 1, limit: 10, totalPages: 1, prev: null, next: null } 
    };
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <CategoriesView initialData={initialData} />
    </div>
  );
}