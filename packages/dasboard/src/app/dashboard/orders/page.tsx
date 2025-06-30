// NO 'use client' directive
import { createServerApiClient } from '@/api/server-api'; // <-- IMPORTANT
import { OrdersView } from './components/orders-view';
import { Order } from '@/types/orders';

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    // This runs ON THE SERVER, calling NestJS directly and securely
    const serverApi = await createServerApiClient();
    const response = await serverApi.get('/dashboard/orders');

    // --- THIS IS THE FIX ---
    // We access the 'data' property from the paginated response object.
    console.log("API response:", response.data);
    orders = response.data.data; 

    // A good practice is to check if the data exists
    if (!orders) {
      console.warn("API response did not contain a 'data' array for orders.");
      orders = []; // Ensure it's always an array
    }

  } catch (error) {
    console.error("Failed to fetch initial orders:", error);
    // The component will render with an empty orders array on error
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <OrdersView initialOrders={orders} />
    </div>
  );
}