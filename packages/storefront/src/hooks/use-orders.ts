"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";
import { useTenantContext } from "@/contexts/tenant-context";
import { CheckoutPayload, OrderResponse } from "@/types/checkout";
import { Order } from "@/types/orders";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Order Hook
 * This hook partitions the cache by tenantId and handles the 
 * secure transition from Cart to Order.
 */
export const useOrders = (customerId?: string) => {
  const queryClient = useQueryClient();
  const { tenant } = useTenantContext();
  const { isAuthenticated } = useAuthContext();

  // Cache partitioned by Store context and Customer context
  const ORDERS_QUERY_KEY = ["storefront-orders", tenant?.id, customerId];

  // --- 1. Fetch Order History (Authenticated) ---
  const ordersQuery = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "list"],
    queryFn: () => {
      if (customerId) return orderService.getByCustomer(customerId);
      return orderService.getAll();
    },
    // Only fetch if the user is logged in or a specific store is selected
    enabled: isAuthenticated || !!tenant?.id,
    placeholderData: keepPreviousData,
  });

  // --- 2. Mutation: Place Order (The Checkout Trigger) ---
  const placeOrderMutation = useMutation({
    mutationFn: (payload: CheckoutPayload) => orderService.placeOrder(payload),
    onSuccess: (response: OrderResponse) => {
      // Invalidate cache so history is fresh
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      
      /**
       * Scale Tip: We don't toast success here because the 
       * CheckoutContext handles the redirect to the confirmation page.
       */
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to process order";
      toast.error(msg);
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    
    // Action: Place Order
    createOrder: placeOrderMutation.mutateAsync, // Use async for the Context handler
    isCreating: placeOrderMutation.isPending,
    createError: (placeOrderMutation.error as any)?.message || null,
  };
};

/**
 * Hook for Single Order Tracking
 */
export const useOrderDetails = (orderId: string | null) => {
  const { tenant } = useTenantContext();

  return useQuery({
    queryKey: ["order-detail", tenant?.id, orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2, // Orders status updates can be cached for 2 mins
  });
};