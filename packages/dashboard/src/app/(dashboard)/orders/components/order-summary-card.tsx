import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { Order } from "@/types/orders";
import { User, Calendar, Mail, Phone } from "lucide-react";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/status-colors";
import { formatMoney } from "@/utils/money";
import { formatDate } from "@/utils/date";

export function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="mt-2 grid gap-6 lg:grid-cols-4">
            <div className=" lg:col-span-2 space-y-2">
             
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : "Guest"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer?.phone || "No phone"}</span>
              </div>
               <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${order.customer?.email}`} className="text-blue-500 hover:underline">{order.customer?.email ?? "No email"}</a>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Order Status:</span>
                <span
                  style={{ color: getOrderStatusColor(order.status) }}
                  className="capitalize"
                >
                  {order.status.toLowerCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Payment Status:</span>
                <span
                  style={{ color: getPaymentStatusColor(order.paymentStatus) }}
                  className="capitalize"
                >
                  {order.paymentStatus.toLowerCase()}
                </span>
              </div>
              <div>
                <span>Order created on </span>
                <span className="font-medium">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
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
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatMoney(Number(order.totalAmount))}</span>
          </div>
        </CardContent>
        {/* </Card> */}
      </Card>
    </>
  );
}
