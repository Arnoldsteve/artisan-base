"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@repo/ui/components/ui/card";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { DashboardOverview } from "@/types/analytics";
import { formatMoney } from "@/utils/money";
import { Currency } from "@/types/currency";

interface StatsOverviewProps {
  overview: DashboardOverview;
  currency: string;
}

/**
 * Enterprise Standard: Visualizing Trends
 */
function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: any;
  trend?: number; // Raw percentage from backend
}) {
  // Logic: Identify if growth is positive, negative, or flat
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  const isNeutral = trend === 0;

  return (
    <Card className="rounded-sm shadow-sm border border-border bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-muted/50 rounded-full">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tighter tabular-nums">
          {value}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {trend !== undefined && (
            <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isPositive ? 'bg-green-50 text-green-600' : 
              isNegative ? 'bg-red-50 text-red-600' : 
              'bg-gray-50 text-gray-600'
            }`}>
              {isPositive && <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />}
              {isNegative && <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
              {isNeutral && <Minus className="h-2.5 w-2.5 mr-0.5" />}
              {Math.abs(trend)}%
            </span>
          )}
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ overview, currency }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Revenue with Real Trend */}
      <StatCard
        title="Total Revenue"
        value={formatMoney(overview.totalRevenue, currency as Currency)}
        description="vs previous 30d"
        icon={DollarSign}
        trend={overview.revenueTrend} // ✅ Real Data from Backend
      />

      {/* 2. Total Orders with Real Trend */}
      <StatCard
        title="Total Orders"
        value={overview.totalOrders.toLocaleString()}
        description="vs previous 30d"
        icon={ShoppingBag}
        trend={overview.ordersTrend} // ✅ Real Data from Backend
      />

      {/* 3. Average Order Value (AOV) */}
      <StatCard
        title="Avg. Order Value"
        value={formatMoney(overview.avgOrderValue, currency as Currency)}
        description="Per transaction"
        icon={TrendingUp}
      />

      {/* 4. Operations Count */}
      <StatCard
        title="Active Reach"
        value={`${overview.daysTracked}`}
        description="Days active on platform"
        icon={Users}
      />
    </div>
  );
}