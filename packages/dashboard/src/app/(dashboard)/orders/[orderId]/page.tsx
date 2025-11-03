import { createServerApiClient } from "@/lib/server-api"; // <-- 1. IMPORT THE SERVER CLIENT
import { Order } from "@/types/orders";
import { PageHeader } from "@/components/shared/page-header";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;

  const serverApi = await createServerApiClient();

  let order: Order;

  try {
    order = await serverApi.get<Order>(
      `/dashboard/orders/${resolvedParams.orderId}`
    );
  } catch (error) {
    console.error(
      `Failed to fetch order ${resolvedParams.orderId} on the server:`,
      error
    );
    notFound();
  }

  console.log("Fetched order on server:", order);
  

  return (
    <>
      <PageHeader title={`Order ${order.orderNumber}`} />
      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        <div className="space-y-6">
          <OrderActions order={order} />
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsTable items={order.items || []} />
          </div>
          <div className="space-y-6">
            <OrderSummaryCard order={order} />
          </div>
        </div>
      </div>
    </>
  );
}
