import { createServerApiClient } from "@/services/server-api";
import { OrdersView } from "./components/orders-view";
import { Order } from "@/types/orders";

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get("/dashboard/orders");

    console.log("API response:", response.data);
    orders = response.data.data;

    if (!orders) {
      console.warn("API response did not contain a 'data' array for orders.");
      orders = [];
    }
  } catch (error) {
    console.error("Failed to fetch initial orders:", error);
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <OrdersView initialOrders={orders} />
    </div>
  );
}
