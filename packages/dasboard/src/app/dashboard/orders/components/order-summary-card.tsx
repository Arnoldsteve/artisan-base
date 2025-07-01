import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Order } from "@/types/orders";
import { User, Calendar } from "lucide-react";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/status-colors";
import { formatCurrency } from "@/utils/format-currency";

/**
 * OrderSummaryCard displays a summary of the order, including status and total.
 */
export function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>
            {order.customer
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : "Guest"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`${getOrderStatusColor(order.status)} hover:bg-none capitalize`}
          >
            {order.status.toLowerCase()}
          </Badge>
          <Badge
            variant="outline"
            className={`${getPaymentStatusColor(order.paymentStatus)} hover:bg-none capitalize`}
          >
            {order.paymentStatus.toLowerCase()}
          </Badge>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
