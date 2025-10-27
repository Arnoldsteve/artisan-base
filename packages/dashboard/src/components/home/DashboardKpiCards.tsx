"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import { DashboardKPI } from "@/types/dashboard";
import { formatMoney } from "@/utils/money";

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
export function DashboardKpiCards({
  kpis,
  isLoading,
  isError,
}: DashboardKpiCardsProps) {
  return (
    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6">
      {isLoading ? (
        <>
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </>
      ) : isError ? (
        <p className="col-span-4 text-sm text-destructive">
          Failed to load dashboard stats.
        </p>
      ) : kpis ? (
        <>
          <Card className="bg-[#fff]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                KSH
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMoney(Number(kpis.totalRevenue))}
              </div>
              <p className="text-xs text-muted-foreground">
                All paid and delivered orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{formatMoney(Number(kpis.salesToday))}
              </div>
              <p className="text-xs text-muted-foreground">
                Orders paid and delivered today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receivables</CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                KSH
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatMoney(Number(kpis.receivables))}
              </div>
              <p className="text-xs text-muted-foreground">
                Delivered but not yet paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cash Collected
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                KSH
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatMoney(Number(kpis.cashCollected))}
              </div>
              <p className="text-xs text-muted-foreground">
                Total payments received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{kpis.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customer accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                {kpis.inactiveProducts} inactive listings
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
