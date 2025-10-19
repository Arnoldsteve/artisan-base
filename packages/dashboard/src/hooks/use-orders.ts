import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import { toast } from "sonner";
import {
  Order,
  CreateOrderDto,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types/shared";

const ORDERS_QUERY_KEY = ["dashboard-orders"];

export function useOrders(
  page = 1,
  limit = 10,
  search = '', 
  initialData?: PaginatedResponse<Order>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Order>>({
    queryKey: [...ORDERS_QUERY_KEY, { page, limit, search }],
    queryFn: () => orderService.getAll({ page, limit, search }),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: page === 1 ? initialData : undefined,
    staleTime: 0,
  });
}

export function useOrder(orderId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Order>({
    queryKey: [...ORDERS_QUERY_KEY, orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !isAuthLoading && isAuthenticated && !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      toast.success(`Order #${newOrder.orderNumber} created successfully.`);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order.");
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { orderId: string; status: OrderStatus }) =>
      orderService.updateStatus(variables.orderId, variables.status),
    onSuccess: (updatedOrder) => {
      toast.success(`Order #${updatedOrder.orderNumber}'s status has been updated.`);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, updatedOrder.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status.");
    },
  });
}

export function useUpdateOrderPaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { orderId: string; paymentStatus: PaymentStatus }) =>
      orderService.updatePaymentStatus(variables.orderId, variables.paymentStatus),
    onSuccess: (updatedOrder) => {
      toast.success(`Order #${updatedOrder.orderNumber}'s payment status has been updated.`);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, updatedOrder.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update payment status.");
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      toast.success("Order deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete order.");
    },
  });
}

export function useBatchDeleteOrders() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderIds: string[]) => orderService.batchDeleteOrders(orderIds),
        onSuccess: (data, variables) => {
            toast.success(`${variables.length} order(s) deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete orders.");
        }
    });
}