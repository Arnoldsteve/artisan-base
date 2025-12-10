"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface SalesByLocationProps {
  filters: {
    period: string;
    category: string;
    location: string;
    paymentMethod: string;
  };
}

export function SalesByLocation({ filters }: SalesByLocationProps) {
  // TODO: Fetch real data using filters
  const isLoading = false;

  const locationData = [
    {
      rank: 1,
      city: "Nairobi",
      revenue: 450000,
      orders: 189,
      avgOrderValue: 2381,
      shippingCost: 15000,
    },
    {
      rank: 2,
      city: "Mombasa",
      revenue: 320000,
      orders: 145,
      avgOrderValue: 2207,
      shippingCost: 18000,
    },
    {
      rank: 3,
      city: "Kisumu",
      revenue: 185000,
      orders: 87,
      avgOrderValue: 2126,
      shippingCost: 12000,
    },
    {
      rank: 4,
      city: "Nakuru",
      revenue: 142000,
      orders: 68,
      avgOrderValue: 2088,
      shippingCost: 9500,
    },
    {
      rank: 5,
      city: "Eldoret",
      revenue: 128000,
      orders: 62,
      avgOrderValue: 2065,
      shippingCost: 8700,
    },
    {
      rank: 6,
      city: "Thika",
      revenue: 95000,
      orders: 45,
      avgOrderValue: 2111,
      shippingCost: 6800,
    },
    {
      rank: 7,
      city: "Malindi",
      revenue: 78000,
      orders: 38,
      avgOrderValue: 2053,
      shippingCost: 7200,
    },
    {
      rank: 8,
      city: "Kitale",
      revenue: 62000,
      orders: 31,
      avgOrderValue: 2000,
      shippingCost: 5500,
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.city}</p>
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
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          <CardTitle>Sales by Location</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Geographic distribution of sales and shipping insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4">Revenue by City</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                className="text-xs"
                tick={{ fill: "#374151" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="city"
                className="text-xs"
                tick={{ fill: "#374151" }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#f97316"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div>
          <h3 className="text-sm font-medium mb-4">Detailed Location Breakdown</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>City/Region</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Avg Order Value</TableHead>
                  <TableHead className="text-right">Shipping Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationData.map((location) => (
                  <TableRow key={location.rank}>
                    <TableCell className="font-medium">
                      #{location.rank}
                    </TableCell>
                    <TableCell className="font-medium">
                      {location.city}
                    </TableCell>
                    <TableCell className="text-right">
                      KSh {location.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {location.orders}
                    </TableCell>
                    <TableCell className="text-right">
                      KSh {location.avgOrderValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      KSh {location.shippingCost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}