"use client";

// No UI imports are needed here anymore besides the layout
// ---
import { useDashboardKpis, useRecentOrders, useSalesOverview } from "@/hooks/use-dashboard";
import { DashboardKpiCards } from "@/components/home/DashboardKpiCards";
import { SalesOverviewChart } from "@/components/home/SalesOverviewChart";
import { RecentOrders } from "@/components/home/RecentOrders";

export default function DashboardPage() {
  // Fetch all data in parallel
  const { data: kpis, isLoading: kpisLoading, isError: kpisIsError } = useDashboardKpis();
  const { data: ordersData, isLoading: ordersLoading, isError: ordersIsError } = useRecentOrders();
  const { data: salesData, isLoading: salesLoading, isError: salesIsError } = useSalesOverview();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <DashboardKpiCards
        kpis={kpis}
        isLoading={kpisLoading}
        isError={kpisIsError}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesOverviewChart
          className="lg:col-span-4"
          data={salesData}
          isLoading={salesLoading}
          isError={salesIsError}
        />
        <RecentOrders
          ordersData={ordersData}
          isLoading={ordersLoading}
          isError={ordersIsError}
        />

      </div>
    </div>
  );
}