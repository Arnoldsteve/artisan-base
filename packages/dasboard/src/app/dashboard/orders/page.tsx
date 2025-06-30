// NO 'use client' directive
import { api } from "@/api";
import { OrdersView } from './components/orders-view';

async function getOrders() {
  // This runs ON THE SERVER
  return api.orders.getAllOrders();
}

export default async function OrdersPage() {
  // This runs ON THE SERVER
  const orders = await getOrders();

  // The component is rendered on the server with data already included
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <OrdersView initialOrders={orders} />
    </div>
  );
}