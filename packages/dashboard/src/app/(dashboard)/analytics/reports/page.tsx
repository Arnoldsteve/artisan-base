"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { GlobalFiltersBar } from "./components/global-filters-bar";
import { KpiMetricsGrid } from "./components/kpi-metrics-grid";
import { RevenueOrdersTrend } from "./components/revenue-orders-trend";
import { OrderStatusFunnel } from "./components/order-status-funnel";
import { RevenueBreakdown } from "./components/revenue-breakdown";
import { BestSellingProductsTable } from "./components/best-selling-products-table";
import { TopCustomersTable } from "./components/top-customers-table";
import { RecentTransactionsTable } from "./components/recent-transactions-table";
import { RefundsReturnsTable } from "./components/refunds-returns-table";
import { useAnalyticsOverview } from "@/hooks/use-analytics-queries";
import { PageHeader } from "@/components/shared/page-header";

export default function ReportsPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useAnalyticsOverview();

  console.log("Analytics Overview Data:", data);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // TODO: Refetch data with new filters
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleMetricClick = (metric: string) => {
    // TODO: Filter tables based on metric clicked
    console.log(`Metric clicked: ${metric}`);
  };

  // Transform overview data for KPI metrics
  const kpiMetrics = data?.data
    ? [
        {
          title: "Total Revenue",
          value: data.data.totalRevenue,
          change: 12.5,
          trend: "up" as const,
          format: "currency" as const,
        },
        {
          title: "Average Order Value",
          value: data.data.averageOrderValue,
          change: 3.2,
          trend: "up" as const,
          format: "currency" as const,
        },
        {
          title: "Total Orders",
          value: data.data.totalOrders,
          change: -2.1,
          trend: "down" as const,
          format: "number" as const,
        },
        {
          title: "Refund Rate",
          value: 2.5,
          change: -0.5,
          trend: "down" as const,
          format: "percentage" as const,
        },
      ]
    : [];

  return (
    <>
      <PageHeader title="Reports & Analytics"></PageHeader>
      <div className="flex flex-col gap-4 p-4">
        {/* Global Filters */}
        <GlobalFiltersBar
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
        />

        {/* KPI Metrics */}
        <KpiMetricsGrid
          metrics={kpiMetrics}
          onMetricClick={handleMetricClick}
          isLoading={isLoading}
        />

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueOrdersTrend />
          <OrderStatusFunnel />
        </div>

        {/* Revenue Breakdown */}
        <RevenueBreakdown />

        {/* Data Tables (Tabbed) */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Best Selling Products</TabsTrigger>
            <TabsTrigger value="customers">Top Customers</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="refunds">Refunds & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <BestSellingProductsTable />
          </TabsContent>
          <TabsContent value="customers" className="mt-6">
            <TopCustomersTable />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <RecentTransactionsTable />
          </TabsContent>
          <TabsContent value="refunds" className="mt-6">
            <RefundsReturnsTable />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
