"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export function CustomerLifetimeValue() {
  // TODO: Fetch real data
  const isLoading = false;

  const averageCLV = 45230;

  const distributionData = [
    { bracket: "0-10k", customers: 145, percentage: 28 },
    { bracket: "10k-25k", customers: 178, percentage: 34 },
    { bracket: "25k-50k", customers: 112, percentage: 22 },
    { bracket: "50k-100k", customers: 58, percentage: 11 },
    { bracket: "100k+", customers: 27, percentage: 5 },
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
          <p className="font-semibold">KSh {payload[0].payload.bracket}</p>
          <p className="text-sm text-blue-600">
            Customers: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.percentage}% of total
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
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle>Customer Lifetime Value</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          CLV distribution across customer base
        </p>
      </CardHeader>
      <CardContent>
        {/* Average CLV */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">Average CLV</div>
          <div className="text-3xl font-bold text-blue-600">
            KSh {averageCLV.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1">
            ↑ 12.5% from last period
          </div>
        </div>

        {/* Distribution Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">CLV Distribution</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="bracket"
                className="text-xs"
                tick={{ fill: "#374151" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "#374151" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="customers"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t space-y-2">
          {distributionData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">KSh {item.bracket}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.customers}</span>
                <span className="text-xs text-muted-foreground">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}