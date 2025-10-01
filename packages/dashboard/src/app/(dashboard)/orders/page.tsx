import { createServerApiClient } from '@/lib/server-api';
import { OrdersView } from './components/orders-view';
import { Order } from '@/types/orders';
import { PaginatedResponse } from '@/types/shared';


export default async function OrdersPage() {
  
  let initialData: PaginatedResponse<Order>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<PaginatedResponse<Order>>("/dashboard/orders");
    
  } catch (error) {
    console.error("Failed to fetch initial orders on the server:", error);

    initialData = { 
      data: [], 
      meta: { total: 0, page: 1, limit: 10, totalPages: 1, prev: null, next: null } 
    };
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <OrdersView initialData={initialData} />
    </div>
  );
}