"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { GlobalFiltersBar } from "./components/global-filters-bar";
import { SalesVelocityMetrics } from "./components/sales-velocity-metrics";
import { SalesByDayOfWeek } from "./components/sales-by-day-of-week";
import { SalesByHour } from "./components/sales-by-hour";
import { SalesByLocation } from "./components/sales-by-location";
import { CustomerSegmentation } from "./components/customer-segmentation";
import { CustomerLifetimeValue } from "./components/customer-lifetime-value";
import { CustomerRetention } from "./components/customer-retention";
import { ProductPerformanceMatrix } from "./components/product-performance-matrix";
import { InactiveProducts } from "./components/inactive-products";

export default function SalesMarketingPage() {
  const [filters, setFilters] = useState({
    period: "30d",
    category: "all",
    location: "all",
    paymentMethod: "all",
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // TODO: Refetch data with new filters
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <>
      <PageHeader title="Sales & Marketing Analytics" />
      <div className="flex flex-col gap-4 p-4">
        {/* Global Filters */}
        <GlobalFiltersBar
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
        />

        {/* Sales Velocity Metrics */}
        <SalesVelocityMetrics filters={filters} />

        {/* Time-Based Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <SalesByDayOfWeek filters={filters} />
          <SalesByHour filters={filters} />
        </div>

        {/* Geographic Analytics */}
        <SalesByLocation filters={filters} />

        {/* Customer Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <CustomerSegmentation />
          <CustomerLifetimeValue />
          <CustomerRetention />
        </div>

        {/* Product Performance */}
        <ProductPerformanceMatrix filters={filters} />

        {/* Inactive Products Alert */}
        <InactiveProducts />
      </div>
    </>
  );
}