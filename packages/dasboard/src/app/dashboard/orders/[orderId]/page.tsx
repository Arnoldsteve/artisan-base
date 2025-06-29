import { PageHeader } from "@/components/shared/page-header";
import { mockOrders } from "@/lib/mock-data/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { OrderItemsTable } from "../components/order-items-table";
import { OrderActions } from "../components/order-actions";
import { OrderSummaryCard } from "../components/order-summary-card";

// This is the main Server Component for the page
export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const order = mockOrders.find(o => o.id === orderId); 

  if (!order) {
    return (
      <div className="p-4 md:p-8 lg:p-10">
        <PageHeader title="Order Not Found" />
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
          <OrderItemsTable items={order.items} />
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
          <OrderActions order={order} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}