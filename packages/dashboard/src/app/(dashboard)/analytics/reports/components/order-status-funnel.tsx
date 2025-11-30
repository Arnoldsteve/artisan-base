import { Progress } from "@repo/ui/components/ui/progress";
import { useOrderStatusDistribution } from "@/hooks/use-analytics-queries";

export function OrderStatusFunnel() {
  const { data, isLoading } = useOrderStatusDistribution();
  // console.log("Order Status Distribution Data:", data);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">Loading...
      </div>
    );
  }

  // Define all possible statuses for consistent display
  const allStatuses = [
    { label: "Pending", key: "pending", color: "bg-yellow-500" },
    { label: "Paid", key: "paid", color: "bg-blue-500" },
    { label: "Packed", key: "packed", color: "bg-purple-500" },
    { label: "Shipped", key: "shipped", color: "bg-indigo-500" },
    { label: "Delivered", key: "delivered", color: "bg-green-500" },
    { label: "Refunded", key: "refunded", color: "bg-red-500" },
    { label: "Cancelled", key: "cancelled", color: "bg-gray-500" },
  ];

  // Convert API response array into a map for easy lookup
  const statusMap = new Map(
    data?.stages?.map((item) => [item.status, item]) || []
  );

  // Build final array with all statuses and default 0 if missing
  const statuses = allStatuses.map((status) => {
    // console.log("Processing status:", status.key);
    const item = statusMap.get(status.key);
    return {
      ...status,
      value: item?.count || 0,
      percentage: item?.percentage || 0,
    };
  });

  const total = statuses.reduce((sum, s) => sum + s.value, 0);
  // console.log("Total Orders:", total);

  return (
    <div className="space-y-4">
      {statuses.map((status) => (
        <div key={status.key} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{status.label}</span>
            <span className="text-muted-foreground">
              {status.value} (
              {total > 0 ? ((status.value / total) * 100).toFixed(1) : "0"}%)
            </span>
          </div>
          <Progress value={status.percentage} className={status.color} />
        </div>
      ))}
    </div>
  );
}
