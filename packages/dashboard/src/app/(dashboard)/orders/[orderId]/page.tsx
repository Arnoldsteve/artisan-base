import { createServerApiClient } from "@/lib/server-api"; // <-- 1. IMPORT THE SERVER CLIENT
import { Order } from "@/types/orders";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";
import { notFound } from "next/navigation";
import { formatMoney } from "@/utils/money";

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

  // console.log("Fetched order on server:", order);

  return (
    <>
      <PageHeader title={`Order ${order.orderNumber}`} />
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsTable items={order.items || []} />
          <Card>
            <CardHeader>
              <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatMoney(Number(order.shippingAmount))}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatMoney(Number(order.taxAmount))}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatMoney(Number(order.totalAmount))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <OrderActions
            orderId={order.id}
            initialStatus={order.status}
            initialPaymentStatus={order.paymentStatus}
          />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
    
    </>
  );
}
