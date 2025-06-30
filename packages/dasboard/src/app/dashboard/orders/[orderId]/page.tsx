// No 'use client' - This remains a fast Server Component

import { createServerApiClient } from '@/api/server-api'; // Import the server-side API client
import { Order } from '@/types/orders';

// Import all the necessary UI components
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";

// This is the main Server Component for the page
export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  let order: Order | null = null;

  try {
    // --- THIS IS THE CORE CHANGE ---
    // Fetch real data directly from the NestJS API on the server
    const serverApi = await createServerApiClient();
    const response = await serverApi.get<Order>(`/dashboard/orders/${orderId}`);
    order = response.data;

  } catch (error) {
    // Log the error for debugging on the server
    console.error(`Failed to fetch order ${orderId}:`, error);
    // `order` will remain null, and the "Not Found" UI will be shown
  }
  
  // If the API call failed or returned no order, show a "Not Found" message
  if (!order) {
    return (
      <div className="p-4 md:p-8 lg:p-10">
        <PageHeader title="Order Not Found" description={`Could not find an order with the ID: ${orderId}`} />
      </div>
    );
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title={`Order ${order.orderNumber}`} />
      
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsTable items={order.items || []} />
          <Card>
              <CardHeader><CardTitle>Financials</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingAmount)}</span></div>
                  <div className="flex justify-between"><span>Taxes</span><span>{formatCurrency(order.taxAmount)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
              </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* These components now receive the real order data */}
          <OrderActions order={order} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}