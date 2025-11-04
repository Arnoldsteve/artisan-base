import { PageHeader } from "@/components/shared/page-header";
import { createServerApiClient } from "@/lib/server-api";
import { NewOrderForm } from "../../components/new-order-form";
import { Order } from "@/types/orders";
import { notFound } from "next/navigation";

export default async function EditOrderPage({
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
    notFound(); // ✅ Same behavior as Order Details page
  }

  return (
    <>
      <PageHeader title={`Edit Order #${order.orderNumber}`} />
      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        Edit order coming soon
        {/* <NewOrderForm initialOrder={order} /> */}
      </div>
    </>
  );
}
