"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface ProductPerformanceMatrixProps {
  filters: {
    period: string;
    category: string;
    location: string;
    paymentMethod: string;
  };
}

export function ProductPerformanceMatrix({ filters }: ProductPerformanceMatrixProps) {
  // TODO: Fetch real data using filters
  const isLoading = false;

  const productData = [
    // Stars: High revenue, high volume
    { name: "Wireless Earbuds", revenue: 180000, units: 120, quadrant: "star" },
    { name: "Smart Watch", revenue: 250000, units: 100, quadrant: "star" },
    { name: "Phone Case", revenue: 90000, units: 300, quadrant: "star" },
    
    // Cash Cows: High revenue, low volume (premium products)
    { name: "Laptop Pro", revenue: 450000, units: 30, quadrant: "cash-cow" },
    { name: "Gaming Console", revenue: 320000, units: 40, quadrant: "cash-cow" },
    
    // Question Marks: Low revenue, high volume (consider price increase?)
    { name: "Phone Charger", revenue: 45000, units: 150, quadrant: "question-mark" },
    { name: "Screen Protector", revenue: 35000, units: 200, quadrant: "question-mark" },
    
    // Dogs: Low revenue, low volume (consider removal)
    { name: "Old Model Phone", revenue: 25000, units: 15, quadrant: "dog" },
    { name: "Basic Headphones", revenue: 18000, units: 30, quadrant: "dog" },
  ];

  // Calculate median values for reference lines
  const medianRevenue = 90000;
  const medianUnits = 100;

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case "star":
        return "#22c55e"; // Green-500
      case "cash-cow":
        return "#3b82f6"; // Blue-500
      case "question-mark":
        return "#eab308"; // Yellow-500
      case "dog":
        return "#ef4444"; // Red-500
      default:
        return "#6366f1"; // Indigo-500
    }
  };

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
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{data.name}</p>
          <p className="text-sm text-blue-600">
            Revenue: KSh {data.revenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Units Sold: {data.units}
          </p>
          <p className="text-xs text-muted-foreground mt-2 capitalize">
            Category: {data.quadrant.replace("-", " ")}
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
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Product Performance Matrix</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyze products by revenue and sales volume
        </p>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Stars</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Cash Cows</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Question Marks</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Dogs</span>
          </div>
        </div>

        {/* Scatter Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="units"
              name="Units Sold"
              className="text-xs"
              tick={{ fill: "#374151" }}
              label={{ value: "Units Sold", position: "insideBottom", offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="revenue"
              name="Revenue"
              className="text-xs"
              tick={{ fill: "#374151" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: "Revenue (KSh)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference Lines */}
            <ReferenceLine
              y={medianRevenue}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <ReferenceLine
              x={medianUnits}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            
            <Scatter data={productData} fill="#6366f1">
              {productData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.quadrant)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Descriptions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg bg-green-50 border-green-200">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-green-900">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Stars (High Revenue, High Volume)
            </h4>
            <p className="text-xs text-green-700">
              Best performers - maintain stock and marketing focus
            </p>
          </div>

          <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-blue-900">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Cash Cows (High Revenue, Low Volume)
            </h4>
            <p className="text-xs text-blue-700">
              Premium products - optimize pricing and margins
            </p>
          </div>

          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-yellow-900">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Question Marks (Low Revenue, High Volume)
            </h4>
            <p className="text-xs text-yellow-700">
              Consider price increase or bundling strategies
            </p>
          </div>

          <div className="p-3 border rounded-lg bg-red-50 border-red-200">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-red-900">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Dogs (Low Revenue, Low Volume)
            </h4>
            <p className="text-xs text-red-700">
              Review for discontinuation or heavy discounting
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}