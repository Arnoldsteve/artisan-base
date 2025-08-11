// File: packages/dasboard/src/hooks/use-billing.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { billingService } from '@/services/billing-service';
import { Plan, Subscription, Invoice } from '@/types/billing'; // Assuming you create this type file

/**
 * A custom hook to manage all billing-related data and actions for a tenant.
 * It handles fetching subscription plans, the current subscription, invoices,
 * and provides functions to manage billing actions.
 */
export function useBilling() {
  // State for the data fetched from the API
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // State to manage loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  // --- Data Fetching ---
  const fetchBillingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch initial data in parallel for efficiency
      const [plansData, subscriptionData] = await Promise.all([
        billingService.getPlans(),
        billingService.getSubscription(),
      ]);
      setPlans(plansData);
      setSubscription(subscriptionData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load billing information.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);


  // --- Actions ---
  const changePlan = useCallback(async (planId: string) => {
    setIsChangingPlan(true);
    setError(null);
    try {
      // The service call returns a checkout URL to redirect the user
      const { checkoutUrl } = await billingService.changePlan(planId);
      // Redirect the user to the payment provider's page
      window.location.href = checkoutUrl;
      // Note: We don't set isChangingPlan to false here, as the page will navigate away.
      return checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to change plan.'));
      setIsChangingPlan(false);
      // Re-throw the error so the calling component can handle it if needed
      throw err;
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    // This can be called on-demand (e.g., when a user clicks an "Invoices" tab)
    setIsLoading(true);
    try {
        const invoicesData = await billingService.getInvoices();
        setInvoices(invoicesData);
    } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load invoices.'));
    } finally {
        setIsLoading(false);
    }
  }, []);


  return {
    // Data
    plans,
    subscription,
    invoices,
    
    // State
    isLoading,
    isChangingPlan,
    error,

    // Actions
    changePlan,
    fetchInvoices,
    refetch: fetchBillingData, // Expose a function to manually refresh data
  };
}