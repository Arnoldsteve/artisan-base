"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing-service";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";
import { 
  CreateSubscriptionDto, 
  ChangePlanDto, 
  SubscriptionPlan 
} from "@/types/billing";

export const useBilling = () => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  const BILLING_KEY = ["billing", tenantId];

  // 1. Fetch Current Store Subscription
  const subscriptionQuery = useQuery({
    queryKey: [...BILLING_KEY, "current"],
    queryFn: () => billingService.getSubscription(),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    retry: false, 
  });

  // 2. NEW: Fetch Payment History
  const historyQuery = useQuery({
    queryKey: [...BILLING_KEY, "history"],
    queryFn: () => billingService.getHistory(),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
  });

  // --- Mutations ---
  const subscribeMutation = useMutation({
    mutationFn: (dto: CreateSubscriptionDto) => billingService.subscribe(dto),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.stkPushRequestId) {
        toast.info("STK Push sent! Please enter your PIN on your phone.");
      }
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
    },
    onError: (err: any) => toast.error(err.message || "Subscription failed"),
  });

  const cancelMutation = useMutation({
    mutationFn: (immediately: boolean) => billingService.cancel(immediately),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      toast.success("Subscription updated.");
    },
    onError: (err: any) => toast.error(err.message || "Cancellation failed"),
  });

  return {
    // State
    subscription: subscriptionQuery.data,
    paymentHistory: historyQuery.data || [], // Added
    isLoading: subscriptionQuery.isLoading || historyQuery.isLoading,
    isError: subscriptionQuery.isError,

    // Actions
    subscribe: subscribeMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
    cancel: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
};

// Hook for Platform Pricing Plans (remains unchanged)
export const usePlans = () => {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ["billing", "plans"],
    queryFn: () => billingService.getPlans(),
    staleTime: 1000 * 60 * 60,
  });
};