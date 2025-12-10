"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

interface SalesByHourProps {
  filters: {
    period: string;
    category: string;
    location: string;
    paymentMethod: string;
  };
}

export function SalesByHour({ filters }: SalesByHourProps) {
  // TODO: Fetch real data using filters
  const isLoading = false;

  const data = [
    { hour: "12 AM", revenue: 5000, orders: 2 },
    { hour: "1 AM", revenue: 3000, orders: 1 },
    { hour: "2 AM", revenue: 2000, orders: 1 },
    { hour: "3 AM", revenue: 1500, orders: 0 },
    { hour: "4 AM", revenue: 2500, orders: 1 },
    { hour: "5 AM", revenue: 4000, orders: 2 },
    { hour: "6 AM", revenue: 8000, orders: 3 },
    { hour: "7 AM", revenue: 12000, orders: 5 },
    { hour: "8 AM", revenue: 18000, orders: 8 },
    { hour: "9 AM", revenue: 25000, orders: 11 },
    { hour: "10 AM", revenue: 32000, orders: 14 },
    { hour: "11 AM", revenue: 38000, orders: 16 },
    { hour: "12 PM", revenue: 42000, orders: 18 },
    { hour: "1 PM", revenue: 45000, orders: 20 },
    { hour: "2 PM", revenue: 52000, orders: 23 },
    { hour: "3 PM", revenue: 48000, orders: 21 },
    { hour: "4 PM", revenue: 40000, orders: 17 },
    { hour: "5 PM", revenue: 35000, orders: 15 },
    { hour: "6 PM", revenue: 30000, orders: 13 },
    { hour: "7 PM", revenue: 28000, orders: 12 },
    { hour: "8 PM", revenue: 25000, orders: 11 },
    { hour: "9 PM", revenue: 20000, orders: 9 },
    { hour: "10 PM", revenue: 15000, orders: 6 },
    { hour: "11 PM", revenue: 10000, orders: 4 },
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
          <p className="font-semibold">{payload[0].payload.hour}</p>
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
        <CardTitle>Hourly Sales Pattern</CardTitle>
        <p className="text-sm text-muted-foreground">
          24-hour breakdown to identify peak shopping hours
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="hour"
              className="text-xs"
              tick={{ fill: "#374151" }}
              interval={2}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "#374151" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}