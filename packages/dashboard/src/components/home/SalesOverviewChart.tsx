import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { SalesOverviewResponse } from "@/types/dashboard";
import { formatMoney } from "@/utils/money";
import { cn } from "@repo/ui/lib/utils";

interface SalesOverviewChartProps {
  data: SalesOverviewResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  className?: string;
}

export function SalesOverviewChart({
  data,
  isLoading,
  isError,
  className,
}: SalesOverviewChartProps) {
  const renderContent = () => {
    if (isLoading) return <Skeleton className="h-[350px] w-full" />;
    if (isError)
      return (
        <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-sm text-destructive">Failed to load sales data.</p>
        </div>
      );
    if (!data || data.sales.length === 0)
      return (
        <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            No sales data found for this period.
          </p>
        </div>
      );

    // Months in order
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Map API data into a dictionary for faster lookup
    const salesMap: Record<string, number> = {};
    data.sales.forEach((item) => {
      salesMap[item.name] = parseFloat(item.total);
    });

    // Fill chart data with all months
    const chartData = months.map((month) => ({
      name: month,
      total: salesMap[month] || 0, // fill missing months with 0
    }));

    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => `${formatMoney(value)}`}
          />
          <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("shadow-none", className)}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">{renderContent()}</CardContent>
    </Card>
  );
}
