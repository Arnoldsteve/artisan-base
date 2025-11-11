import { createServerApiClient } from "@/lib/server-api";
import { OrdersWrapper } from "./components/orders-wrapper";
import { Order } from "@/types/orders";
import { PaginatedResponse } from "@/types/shared";

export default async function OrdersPage() {
  let initialData: PaginatedResponse<Order>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<PaginatedResponse<Order>>(
      "/dashboard/orders",
      { page: 1, limit: 10 }
    );
  } catch (error) {
    console.error("Failed to fetch initial orders on the server:", error);

    initialData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        prev: null,
        next: null,
      },
    };
  }

  return <OrdersWrapper initialOrderData={initialData} />;
}
