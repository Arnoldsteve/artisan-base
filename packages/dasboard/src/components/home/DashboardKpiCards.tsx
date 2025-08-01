// C:\Users\Admin\Documents\Arnold\Personal Work\artisan-base\packages\dasboard\src\components\home\DashboardKpiCards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { DashboardKPI } from "@/types/dashboard";

/**
 * A local, self-contained skeleton component for a single KPI card.
 */
const KpiCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-3/5" />
      <Skeleton className="h-3 w-4/5 mt-2" />
    </CardContent>
  </Card>
);

/**
 * Props for the DashboardKpiCards component.
 * It takes the data and state from the `useDashboardKpis` hook.
 */
interface DashboardKpiCardsProps {
  kpis: DashboardKPI | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * A component that renders the grid of 4 KPI cards for the dashboard.
 * It handles its own loading and error states internally.
 */
export function DashboardKpiCards({ kpis, isLoading, isError }: DashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        // --- Loading State ---
        <>
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </>
      ) : isError ? (
        // --- Error State ---
        <p className="col-span-4 text-sm text-destructive">
          Failed to load dashboard stats.
        </p>
      ) : kpis ? (
        // --- Success State ---
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{formatCurrency(kpis.salesToday)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{kpis.totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.activeProducts}</div>
              <p className="text-xs text-muted-foreground">{kpis.inactiveProducts} Inactive</p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}