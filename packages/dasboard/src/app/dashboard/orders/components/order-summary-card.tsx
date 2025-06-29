import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { getOrderStatusColor, getPaymentStatusColor } from "./columns"; // Let's reuse our color logic
import { User, Calendar, Truck } from "lucide-react";

export function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'}</span>
        </div>
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
            <Badge className={`${getOrderStatusColor(order.status)} hover:bg-none capitalize`}>{order.status.toLowerCase()}</Badge>
            <Badge variant="outline" className={`${getPaymentStatusColor(order.paymentStatus)} hover:bg-none capitalize`}>{order.paymentStatus.toLowerCase()}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}