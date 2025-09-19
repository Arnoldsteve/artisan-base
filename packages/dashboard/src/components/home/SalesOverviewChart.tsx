"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { SalesOverviewResponse } from "@/types/dashboard";

/**
 * Props for the SalesOverviewChart component.
 * It now accepts an optional className to be passed to the root Card element.
 */
interface SalesOverviewChartProps {
  data: SalesOverviewResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  className?: string;
}

/**
 * A self-contained client component that renders the entire "Sales Overview" card,
 * including its title, content, and the chart itself.
 */
export function SalesOverviewChart({ data, isLoading, isError, className }: SalesOverviewChartProps) {
  const renderContent = () => {
    // 1. Handle the loading state
    if (isLoading) {
      return <Skeleton className="h-[350px] w-full" />;
    }

    // 2. Handle any potential API errors
    if (isError) {
      return (
        <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-sm text-destructive">Failed to load sales data.</p>
        </div>
      );
    }

    // 3. Handle the case where the API returns no sales data
    if (!data || data.sales.length === 0) {
      return (
        <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">No sales data found for this period.</p>
        </div>
      );
    }

    // 4. Prepare the data for Recharts
    const chartData = data.sales.map(item => ({
      name: item.name,
      total: parseFloat(item.total),
    }));

    // 5. Render the final chart
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {renderContent()}
      </CardContent>
    </Card>
  );
}