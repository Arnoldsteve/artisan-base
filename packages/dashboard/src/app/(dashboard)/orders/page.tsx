import { createServerApiClient } from '@/lib/server-api';
import { OrdersView } from './components/orders-view';
import { Order } from '@/types/orders';
import { PaginatedResponse } from '@/types/shared';

/**
 * This is the Server Component for the Orders page.
 * It fetches the initial data on the server for a fast page load.
 */
export default async function OrdersPage() {
  
  let initialData: PaginatedResponse<Order>;

  try {
    const serverApi = await createServerApiClient();
    // Fetch the full paginated response
    initialData = await serverApi.get<PaginatedResponse<Order>>("/dashboard/orders");
    
  } catch (error) {
    console.error("Failed to fetch initial orders on the server:", error);
    // Provide a default empty state in case of an error
    initialData = { 
      data: [], 
      meta: { total: 0, page: 1, limit: 10, totalPages: 1, prev: null, next: null } 
    };
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      {/* Pass the full initialData object to the client view */}
      <OrdersView initialData={initialData} />
    </div>
  );
}