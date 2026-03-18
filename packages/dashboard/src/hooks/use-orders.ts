"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { orderService } from "@/services/order-service";
import { useAuthContext } from "@/contexts/auth-context";
import { 
  Order, 
  CreateOrderDto, 
  OrderStatus, 
  PaymentStatus 
} from "@/types/orders";
import { PaginatedResponse } from "@/types";

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Orders List
// ---------------------------------------------------------
export const useOrders = (
  initialLimit = 10, 
  initialData?: PaginatedResponse<Order>
) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const ORDERS_QUERY_KEY = ["orders", tenantId];

  // --- Fetch Query ---
  const ordersQuery = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "list", { page, search, initialLimit }],
    queryFn: () => orderService.getAll({ page, limit: initialLimit, search }),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
    // 🎯 THE FIX: Hydrate with server-side data if available
    initialData: page === 1 && !search ? initialData : undefined,
  });

  // --- Mutations ---
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(`Order #${newOrder.orderNumber} created successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create order"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["order", tenantId, updated.id] });
      toast.success(`Order status updated to ${updated.status}`);
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      orderService.updatePaymentStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["order", tenantId, updated.id] });
      toast.success(`Payment status updated to ${updated.paymentStatus}`);
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success("Order deleted successfully");
    },
    onError: () => toast.error("Failed to delete order"),
  });

  // --- Return Unified Interface ---
  return {
    // Data & Meta
    orders: ordersQuery.data?.data || [],
    meta: ordersQuery.data?.meta,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,

    // State Management
    page,
    setPage,
    search,
    setSearch,

    // Actions
    createOrder: createOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    updatePaymentStatus: updatePaymentStatusMutation.mutate,
    isUpdatingPayment: updatePaymentStatusMutation.isPending,

    deleteOrder: deleteOrderMutation.mutate,
    isDeleting: deleteOrderMutation.isPending,
  };
};

// ---------------------------------------------------------
// 2. Hook for Fetching a Single Order
// ---------------------------------------------------------
export const useOrder = (id: string | null) => {
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  return useQuery({
    queryKey: ["order", tenantId, id],
    queryFn: () => orderService.getById(id!),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId && !!id,
  });
};