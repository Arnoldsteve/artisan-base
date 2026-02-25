"use client";

import React, { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useBilling, usePlans } from "@/hooks/use-billing";
import { useAuthContext } from "@/contexts/auth-context";
import { DataTableSkeleton } from "@/components/shared/data-table";

// UI Components
import { CurrentPlanCard } from "./current-plan-card";
import { PricingTable } from "./pricing-table";
import { BillingHistoryTable } from "./billing-history-table";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";

export function BillingWrapper() {
  const { tenants, tenantId } = useAuthContext();
  
  // 1. Hook Integration
  const { 
    subscription, 
    paymentHistory, 
    isLoading: isSubLoading, 
    isError: isSubError 
  } = useBilling();
  
  const { 
    data: plans, 
    isLoading: isPlansLoading, 
    isError: isPlansError 
  } = usePlans();

  // 2. Memoized Regional Context
  // We memoize this to prevent re-calculations on every render cycle
  const activeTenant = useMemo(() => 
    tenants.find((t) => t.id === tenantId), 
  [tenants, tenantId]);

  const isKenya = activeTenant?.baseCurrency === "KES";

  // 3. Global Loading State
  if (isSubLoading || isPlansLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <div className="h-10 w-1/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </div>
        <DataTableSkeleton />
      </div>
    );
  }

  // 4. Error State handling
  if (isSubError || isPlansError) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Billing System Offline</h3>
        <p className="text-muted-foreground max-w-xs">
          We are having trouble connecting to the payment gateway. Please refresh or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Billing & Subscription" 
        // description="Manage your subscription plans and review your transaction history."
      />

      <div className="px-4 pb-24 space-y-10">
        {/* A. Regional Context Banner */}
        <Alert className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-300 font-bold">
            Currency: {activeTenant?.baseCurrency || 'USD'}
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
            Payment processing is optimized for {isKenya ? "Kenya (M-Pesa STK Push)" : "International (Card/Stripe)"}.
          </AlertDescription>
        </Alert>

        {/* B. Active Subscription Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Subscription</h2>
          </div>
          {subscription ? (
            <CurrentPlanCard 
              subscription={subscription} 
              isKenya={isKenya}
            />
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center bg-muted/5 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-1 italic">No active plan for {activeTenant?.name}.</p>
              <p className="text-xs text-muted-foreground/60">Choose a plan below to get started.</p>
            </div>
          )}
        </section>

        {/* C. Plans & Upgrades Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Available Tiers</h2>
          <PricingTable 
            plans={plans || []} 
            currentPlanId={subscription?.plan?.id}
            isKenya={isKenya}
          />
        </section>

        {/* D. Audit Trail (Billing History) */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Transaction History</h2>
          <BillingHistoryTable data={paymentHistory} />
        </section>
      </div>
    </div>
  );
}