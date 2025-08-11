// File: packages/dasboard/src/hooks/use-billing.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing-service";
import { toast } from "sonner";
import { Plan, Subscription, Invoice } from "@/types/billing";
import { useAuthContext } from "@/contexts/auth-context"; // Assuming you have this context

// Define a query key to uniquely identify all billing-related data
const BILLING_QUERY_KEY = ["dashboard-billing"];

/**
 * Hook for fetching the list of all available subscription plans.
 * It is "auth-aware" and will not run until the user is authenticated.
 */
export function useBillingPlans(initialData?: Plan[]) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Plan[]>({
    queryKey: [...BILLING_QUERY_KEY, 'plans'],
    queryFn: () => billingService.getPlans(),
    // This query will only run if auth is not loading AND the user is authenticated
    enabled: !isAuthLoading && isAuthenticated,
    // Provides server-fetched data to prevent a loading flicker on the first visit
    initialData: initialData,
  });
}

/**
 * Hook for fetching the tenant's current subscription.
 */
export function useBillingSubscription(initialData?: Subscription | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Subscription | null>({
    queryKey: [...BILLING_QUERY_KEY, 'subscription'],
    queryFn: () => billingService.getSubscription(),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: initialData,
  });
}

/**
 * Hook for fetching the tenant's invoice history.
 */
export function useBillingInvoices(initialData?: Invoice[]) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Invoice[]>({
    queryKey: [...BILLING_QUERY_KEY, 'invoices'],
    queryFn: () => billingService.getInvoices(),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: initialData,
  });
}

/**
 * Hook for initiating a plan change.
 * Returns a `mutate` function to trigger the change.
 */
export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => billingService.changePlan(planId),
    onSuccess: (response) => { 
        toast.info("Redirecting to the billing portal...");
        const checkoutUrl = response.checkoutUrl;
        console.log("Full response from server:", response);

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Could not get checkout URL from the server.");
          console.error("Checkout URL was not found in the response:", response);
        }

        // Invalidate the query as before
        queryClient.invalidateQueries({ queryKey: [...BILLING_QUERY_KEY, 'subscription'] });
      },
  });
}

/**
 * Hook for downloading an invoice.
 */
export function useDownloadInvoice() {
    return useMutation({
        mutationFn: (invoiceId: string) => billingService.downloadInvoice(invoiceId),
        onSuccess: (blob, invoiceId) => {
            // Create a temporary link to trigger the browser's download dialog
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoiceId}.pdf`; // Name the downloaded file
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up the temporary URL
            toast.success("Invoice download started.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to download invoice.");
        }
    });
}