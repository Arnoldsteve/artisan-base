"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useDashboardSummary } from "@/hooks";
import { useAuthContext } from "@/contexts/auth-context";
import { DataTableSkeleton } from "@/components/shared/data-table";
import { StatsOverview } from "./components/stats-overview";
import { RevenueChart } from "./components/revenue-chart";
import { RecentActivity } from "./components/recent-activity";
import { Button } from "@repo/ui/components/ui/button";


export function DashboardWrapper() {
  const { tenantId, baseCurrency } = useAuthContext();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  console.log("Dashboard data", data);

  // 1. Loading State: Uses a skeleton to prevent layout shift
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-1/4 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded" />)}
        </div>
        <div className="h-[400px] bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // 2. Error State: High-scale resilience
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-muted-foreground mb-4">Failed to load dashboard metrics.</p>
        <Button 
            type={'button'}
          onClick={() => refetch()}
          className="text-sm font-bold text-blue-600  uppercase"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Store Overview" 
        // description="Monitor your artisan business performance in real-time."
      />

      <div className="px-4 pb-20 space-y-8">
        {/* A. KPI Cards Section (The 'Big Numbers') */}
        <StatsOverview 
          overview={data.overview} 
          currency={baseCurrency || "KES"} 
        />

        {/* B. Main Visualization Section (The 'Growth Chart') */}
        <div className="grid grid-cols-1 gap-8">
          <RevenueChart data={data.chartData} currency={baseCurrency || "KES"} />
        </div>

        {/* C. Bottom Activity Section */}
        <RecentActivity />
      </div>
    </div>
  );
}