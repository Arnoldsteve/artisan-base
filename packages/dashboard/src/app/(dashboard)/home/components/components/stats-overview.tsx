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
  ArrowDownRight
} from "lucide-react";
import { DashboardOverview } from "@/types/analytics";
import { formatMoney } from "@/utils/money";
import { Currency } from "@/types/currency";

interface StatsOverviewProps {
  overview: DashboardOverview;
  currency: string;
}

/**
 * SOLID Principle: Single Responsibility
 * This internal component is the visual standard for all KPI cards.
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
  trend?: { value: number; isPositive: boolean };
}) {
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
          {trend && (
            <span className={`flex items-center text-[10px] font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}%
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
      {/* 1. Total Revenue (Currency Localized) */}
      <StatCard
        title="Total Revenue"
        value={formatMoney(overview.totalRevenue, currency as Currency)}
        description="Since shop launch"
        icon={DollarSign}
        // Trend logic can be wired here once backend provides history comparison
        trend={{ value: 12, isPositive: true }} 
      />

      {/* 2. Total Orders */}
      <StatCard
        title="Total Orders"
        value={overview.totalOrders.toLocaleString()}
        description="Across all categories"
        icon={ShoppingBag}
        trend={{ value: 8, isPositive: true }}
      />

      {/* 3. Average Order Value (AOV) */}
      <StatCard
        title="Avg. Order Value"
        value={formatMoney(overview.avgOrderValue, currency as Currency)}
        description="Per transaction"
        icon={TrendingUp}
      />

      {/* 4. Active Reach */}
      <StatCard
        title="Global Presence"
        value={`${overview.daysTracked}`}
        description="Days of operations"
        icon={Users}
      />
    </div>
  );
}