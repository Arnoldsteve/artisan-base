// No 'use client' - This remains a fast Server Component

import { OrderService, orderService } from "@/services/order-service";
import { Order } from "@/types/orders";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";
import { formatCurrency } from "@/utils/format-currency";

interface OrderDetailPageProps {
  params: { orderId: string };
  service?: OrderService;
}

/**
 * OrderDetailPage displays the details of a single order.
 */
export default async function OrderDetailPage({
  params,
  service = orderService,
}: OrderDetailPageProps) {
  const { orderId } = params;
  let order: Order | null = null;
  try {
    order = await service.getById(orderId);
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
  }
  if (!order) {
    return (
      <div className="p-4 md:p-8 lg:p-10">
        <PageHeader
          title="Order Not Found"
          description={`Could not find an order with the ID: ${orderId}`}
        />
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title={`Order ${order.orderNumber}`} />
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
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <OrderActions orderId={order.id} onUpdateStatusClick={() => {}} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}
