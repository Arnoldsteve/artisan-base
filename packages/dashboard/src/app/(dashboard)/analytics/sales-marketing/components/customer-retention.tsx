"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

export function CustomerRetention() {
  // TODO: Fetch real data
  const isLoading = false;

  const repeatPurchaseRate = 42.5;
  const avgTimeBetweenOrders = 18;

  const retentionData = [
    { month: "Jan", rate: 38 },
    { month: "Feb", rate: 40 },
    { month: "Mar", rate: 39 },
    { month: "Apr", rate: 41 },
    { month: "May", rate: 43 },
    { month: "Jun", rate: 42.5 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.month}</p>
          <p className="text-sm text-blue-600">
            Retention Rate: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-green-600" />
          <CardTitle>Customer Retention</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Repeat purchase behavior
        </p>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xs text-gray-600 mb-1">
              Repeat Purchase Rate
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {repeatPurchaseRate}%
            </div>
            <div className="text-xs text-green-600 mt-1">
              ↑ 3.2% from last period
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-xs text-gray-600 mb-1">
              Avg Time Between Orders
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {avgTimeBetweenOrders} days
            </div>
            <div className="text-xs text-green-600 mt-1">
              ↓ 2 days improvement
            </div>
          </div>
        </div>

        {/* Retention Trend */}
        <div>
          <h4 className="text-sm font-medium mb-3">Retention Trend (Last 6 Months)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "#374151" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "#374151" }}
                domain={[35, 45]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Insights */}
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">First-time buyers</span>
              <span className="font-medium">57.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">2+ purchases</span>
              <span className="font-medium">30.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">5+ purchases (Loyal)</span>
              <span className="font-medium">12.3%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}