// This is the PURE Server Component.

import { createServerApiClient } from '@/lib/server-api';
import { CustomersView } from './components/customers-view';
import { Customer, PaginatedResponse } from '@/types/customers';

export default async function CustomersPage() {
  
  // This variable will hold the ENTIRE paginated response object.
  let initialData: PaginatedResponse<Customer>;

  try {
    const serverApi = await createServerApiClient();
    
    // THE FIX: Assign the WHOLE response to the initialData variable.
    initialData = await serverApi.get<PaginatedResponse<Customer>>("/dashboard/customers");
    console.log("Fetched initial data on the server:", initialData);

  } catch (error) {
    console.error("Failed to fetch initial customers on the server:", error);
    // On error, create a default paginated structure so the client component doesn't break.
    initialData = { 
      data: [], 
      meta: { total: 0, page: 1, limit: 10, totalPages: 1, prev: null, next: null } 
    };
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      {/* 
        THE FIX: The prop name is now `initialData`, which matches what the
        CustomersView component expects in its props interface.
      */}
      <CustomersView initialData={initialData} />
    </div>
  );
}