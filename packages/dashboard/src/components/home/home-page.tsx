"use client";

import {
  useDashboardKpis,
  useRecentOrders,
  useSalesOverview,
} from "@/hooks/use-dashboard";
import { DashboardKpiCards } from "@/components/home/DashboardKpiCards";
import { SalesOverviewChart } from "@/components/home/SalesOverviewChart";
import { RecentOrders } from "@/components/home/RecentOrders";
import { PageHeader } from "../shared/page-header";

export default function HomePage() {
  // Fetch all data in parallel
  const {
    data: kpis,
    isLoading: kpisLoading,
    isError: kpisIsError,
  } = useDashboardKpis();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
  } = useRecentOrders();
  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesIsError,
  } = useSalesOverview();

  return (
    <>
      <PageHeader title="Dashboard Overview">
      </PageHeader>

      <div className="px-4 space-y-4">
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
    </>
  );
}