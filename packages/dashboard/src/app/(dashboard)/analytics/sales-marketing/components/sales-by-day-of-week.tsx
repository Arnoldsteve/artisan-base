"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

interface SalesByDayOfWeekProps {
  filters: {
    period: string;
    category: string;
    location: string;
    paymentMethod: string;
  };
}

export function SalesByDayOfWeek({ filters }: SalesByDayOfWeekProps) {
  // TODO: Fetch real data using filters
  const isLoading = false;

  const data = [
    { day: "Mon", revenue: 45000, orders: 18 },
    { day: "Tue", revenue: 52000, orders: 22 },
    { day: "Wed", revenue: 48000, orders: 20 },
    { day: "Thu", revenue: 61000, orders: 25 },
    { day: "Fri", revenue: 75000, orders: 32 },
    { day: "Sat", revenue: 68000, orders: 28 },
    { day: "Sun", revenue: 42000, orders: 16 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.day}</p>
          <p className="text-sm text-blue-600">
            Revenue: KSh {payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Orders: {payload[0].payload.orders}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Day of Week</CardTitle>
        <p className="text-sm text-muted-foreground">
          Identify peak shopping days to plan marketing campaigns
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: "#374151" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "#374151" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}