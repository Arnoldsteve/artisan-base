"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing-service";
import { toast } from "sonner";
import { Plan, Subscription, Invoice } from "@/types/billing";
import { useAuthContext } from "@/contexts/auth-context"; 

const BILLING_QUERY_KEY = ["dashboard-billing"];

export function useBillingPlans(initialData?: Plan[]) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Plan[]>({
    queryKey: [...BILLING_QUERY_KEY, 'plans'],
    queryFn: () => billingService.getPlans(),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: initialData,
  });
}

export function useBillingSubscription(initialData?: Subscription | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Subscription | null>({
    queryKey: [...BILLING_QUERY_KEY, 'subscription'],
    queryFn: () => billingService.getSubscription(),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: initialData,
  });
}

export function useBillingInvoices(initialData?: Invoice[]) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Invoice[]>({
    queryKey: [...BILLING_QUERY_KEY, 'invoices'],
    queryFn: () => billingService.getInvoices(),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: initialData,
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (planId: string) => billingService.changePlan(planId),
    onSuccess: (response, planId) => {
      toast.success(response.message || "Plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: [...BILLING_QUERY_KEY, 'subscription'] });
    },

    onError: (error: Error, planId) => {
      toast.error(error.message || `Failed to switch to plan ${planId}.`);
    },
  });
}

export function useDownloadInvoice() {
    return useMutation({
        mutationFn: (invoiceId: string) => billingService.downloadInvoice(invoiceId),
        onSuccess: (blob, invoiceId) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoiceId}.pdf`; 
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); 
            toast.success("Invoice download started.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to download invoice.");
        }
    });
}