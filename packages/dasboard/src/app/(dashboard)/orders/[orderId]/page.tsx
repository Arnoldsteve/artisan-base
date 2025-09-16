// File: packages/dasboard/src/app/dashboard/orders/[orderId]/page.tsx
// No 'use client' - This remains a fast Server Component

import { createServerApiClient } from "@/lib/server-api"; // <-- 1. IMPORT THE SERVER CLIENT
import { Order } from "@/types/orders";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";
import { formatCurrency } from "@/utils/format-currency";
import { notFound } from "next/navigation"; // Import notFound

interface OrderDetailPageProps {
  params: { orderId: string };
}

/**
 * OrderDetailPage displays the details of a single order.
 * It fetches data on the server using a request-specific, authenticated API client.
 */
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = params;
  
  // 2. CREATE A NEW, AUTHENTICATED API CLIENT FOR THIS REQUEST
  const serverApi = await createServerApiClient();
  
  let order: Order;

  try {
    // 3. USE THE NEW SERVER CLIENT TO FETCH DATA
    order = await serverApi.get<Order>(`/dashboard/orders/${orderId}`);
  } catch (error) {
    console.error(`Failed to fetch order ${orderId} on the server:`, error);
    // If the API call fails (e.g., returns 404), trigger Next.js's 404 page.
    notFound();
  }
  
  console.log("Fetched order on server:", order);

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
                {/* Use a helper to format Decimal to currency string */}
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
          <OrderActions orderId={order.id} initialStatus={order.status} initialPaymentStatus={order.paymentStatus} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}