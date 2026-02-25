"use client";

import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { DailyChartData } from "@/types/analytics";
import { formatMoney } from "@/utils/money";
import { Currency } from "@/types/currency";

interface RevenueChartProps {
  data: DailyChartData[];
  currency: string;
}

/**
 * TOP 1% ARCHITECTURE: Specialized Visualization Component
 * millions of users: Optimized to render time-series data from 
 * pre-aggregated analytics tables.
 */
export function RevenueChart({ data, currency }: RevenueChartProps) {
  // 1. Data Sanitization: Ensure chart doesn't crash if data is empty
  const hasData = data && data.length > 0;

  return (
    <Card className="rounded-sm shadow-sm border border-border bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight">
            Revenue Performance
          </CardTitle>
          <CardDescription className="text-xs uppercase font-medium tracking-wider">
            Daily growth trends for the last 30 days
          </CardDescription>
        </div>
        {/* Placeholder for future DateRangePicker component */}
        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-tighter">
          LIVE UPDATES
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[350px] w-full">
          {!hasData ? (
            <div className="h-full w-full flex items-center justify-center border-2 border-dashed rounded-sm bg-muted/5">
              <p className="text-sm text-muted-foreground italic">
                Waiting for your first successful sale...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  vertical={false} 
                  strokeDasharray="3 3" 
                  className="stroke-muted" 
                />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => 
                    formatMoney(value, currency as Currency, { 
                      showSymbol: false, 
                      precision: 0 
                    })
                  }
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-sm border bg-background p-3 shadow-md">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                            {new Date(payload[0].payload.date).toDateString()}
                          </p>
                          <p className="text-sm font-black text-blue-600">
                            {formatMoney(payload[0].value as number, currency as Currency)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                            {payload[0].payload.orders} successful orders
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}