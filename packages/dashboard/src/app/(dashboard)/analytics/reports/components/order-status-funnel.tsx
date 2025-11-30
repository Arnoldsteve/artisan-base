"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Progress } from "@repo/ui/components/ui/progress";
import { useAnalyticsOverview } from "@/hooks/use-analytics-queries";


export function OrderStatusFunnel() {
  const { data, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

 const statuses = [
  { label: "Pending", value: data?.data?.ordersByStatus?.pending || 0, color: "bg-yellow-500" },
  { label: "Paid", value: data?.data?.ordersByStatus?.paid || 0, color: "bg-blue-500" },
  { label: "Packed", value: data?.data?.ordersByStatus?.packed || 0, color: "bg-purple-500" },
  { label: "Shipped", value: data?.data?.ordersByStatus?.shipped || 0, color: "bg-indigo-500" },
  { label: "Delivered", value: data?.data?.ordersByStatus?.delivered || 0, color: "bg-green-500" },
  { label: "Refunded", value: data?.data?.ordersByStatus?.refunded || 0, color: "bg-red-500" },
];

  const total = statuses.reduce((sum, status) => sum + status.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statuses.map((status) => {
          const percentage = total > 0 ? (status.value / total) * 100 : 0;
          return (
            <div key={status.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{status.label}</span>
                <span className="text-muted-foreground">
                  {status.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={percentage} className={status.color} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}