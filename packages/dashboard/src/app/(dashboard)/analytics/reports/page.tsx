"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { GlobalFiltersBar } from "./components/global-filters-bar";
import { RevenueOrdersTrend } from "./components/revenue-orders-trend";
import { OrderStatusFunnel } from "./components/order-status-funnel";
import { RevenueBreakdown } from "./components/revenue-breakdown";
import { BestSellingProductsTable } from "./components/best-selling-products-table";
import { TopCustomersTable } from "./components/top-customers-table";
import { RecentTransactionsTable } from "./components/recent-transactions-table";
import { RefundsReturnsTable } from "./components/refunds-returns-table";
import { useAnalyticsOverview } from "@/hooks/use-analytics-queries";
import { PageHeader } from "@/components/shared/page-header";
import { KpiSection } from "./components/kpi-metrics-grid";

export default function ReportsPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useAnalyticsOverview();

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

  // Revenue KPIs
  const revenueMetrics = data
    ? [
        {
          title: "Total Revenue",
          value: data.revenue.totalRevenue,
          change: 12.5,
          trend: "up" as const,
          format: "currency" as const,
        },
        {
          title: "Paid Revenue",
          value: data.revenue.paidRevenue,
          change: 8.3,
          trend: "up" as const,
          format: "currency" as const,
        },
        {
          title: "Pending Revenue",
          value: data.revenue.pendingRevenue,
          change: -2.1,
          trend: "down" as const,
          format: "currency" as const,
        },
        {
          title: "Average Order Value",
          value: data.revenue.averageOrderValue,
          change: 3.2,
          trend: "up" as const,
          format: "currency" as const,
        },
      ]
    : [];

  // Orders KPIs
  const ordersMetrics = data
    ? [
        {
          title: "Total Orders",
          value: data.orders.totalOrders,
          change: 15.4,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "Pending Orders",
          value: data.orders.pendingOrders,
          change: -5.2,
          trend: "down" as const,
          format: "number" as const,
        },
        {
          title: "Delivered Orders",
          value: data.orders.deliveredOrders,
          change: 18.7,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "Avg Processing Time",
          value: data.orders.averageProcessingTime,
          change: -10.5,
          trend: "down" as const,
          format: "days" as const,
        },
      ]
    : [];

  // Customers KPIs
  const customersMetrics = data
    ? [
        {
          title: "Total Customers",
          value: data.customers.totalCustomers,
          change: 22.8,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "New Customers",
          value: data.customers.newCustomers,
          change: 45.2,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "Returning Customers",
          value: data.customers.returningCustomers,
          change: 12.3,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "Avg Lifetime Value",
          value: data.customers.averageLifetimeValue,
          change: 8.9,
          trend: "up" as const,
          format: "currency" as const,
        },
      ]
    : [];

  // Products KPIs
  const productsMetrics = data
    ? [
        {
          title: "Total Products",
          value: data.products.totalProducts,
          trend: "neutral" as const,
          format: "number" as const,
        },
        {
          title: "Active Products",
          value: data.products.activeProducts,
          change: 5.2,
          trend: "up" as const,
          format: "number" as const,
        },
        {
          title: "Low Stock Products",
          value: data.products.lowStockProducts,
          change: -15.3,
          trend: "down" as const,
          format: "number" as const,
        },
        {
          title: "Total Inventory Value",
          value: data.products.totalInventoryValue,
          change: 12.4,
          trend: "up" as const,
          format: "currency" as const,
        },
      ]
    : [];

  return (
    <>
      <PageHeader title="Reports & Analytics" />
      <div className="flex flex-col gap-4 p-4">
        {/* Global Filters */}
        <GlobalFiltersBar
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
        />

        {/* Revenue KPIs */}
        <KpiSection
          title="Revenue"
          metrics={revenueMetrics}
          onMetricClick={handleMetricClick}
          isLoading={isLoading}
        />

        {/* Orders KPIs */}
        <KpiSection
          title="Orders"
          metrics={ordersMetrics}
          onMetricClick={handleMetricClick}
          isLoading={isLoading}
        />

        {/* Customers KPIs */}
        <KpiSection
          title="Customers"
          metrics={customersMetrics}
          onMetricClick={handleMetricClick}
          isLoading={isLoading}
        />

        {/* Products KPIs */}
        <KpiSection
          title="Products"
          metrics={productsMetrics}
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