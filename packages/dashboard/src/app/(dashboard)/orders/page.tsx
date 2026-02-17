import { createServerApiClient } from "@/lib/server-api";
import { OrdersWrapper } from "./components/orders-wrapper";
import { Order } from "@/types/orders";
import { PaginatedResponse } from "@/types/shared";

export default async function OrdersPage() {

  return <OrdersWrapper initialOrderData={undefined} />;
}
