// REMOVE 'use client'; This is now a Server Component.

import { createServerApiClient } from '@/lib/server-api'; // <-- Use the NEW server-api path
import { CustomersView } from './components/customers-view';
import { Customer, PaginatedResponse } from '@/types/customers';

export default async function CustomersPage() {
  let initialCustomers: Customer[] = [];

  try {
    // This code now runs ONLY on the server during the initial render.
    const serverApi = await createServerApiClient();
    const response = await serverApi.get<PaginatedResponse<Customer>>("/dashboard/customers");
    console.log("Fetched initial customers on the server:", response);
    
    // The actual data is in the `data` property of the paginated response
    initialCustomers = response.data; 
    console.log("Initial customers data:", initialCustomers);

  } catch (error) {
    console.error("Failed to fetch initial customers on the server:", error);
    // You might want to render an error state here
  }

  // Pass the server-fetched data as a prop to the Client Component.
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <CustomersView initialCustomers={initialCustomers} />
    </div>
  );
}