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

// Define a query key to uniquely identify all order-related data
const ORDERS_QUERY_KEY = ["dashboard-orders"];

/**
 * Hook for fetching a paginated list of orders.
 * It is "auth-aware" and will not run until the user is authenticated.
 */
export function useOrders(
  page = 1,
  limit = 10,
  search = '', // Assuming you might add search functionality later
  initialData?: PaginatedResponse<Order>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Order>>({
    // The query key is an array that uniquely identifies this specific data fetch
    queryKey: [...ORDERS_QUERY_KEY, { page, limit, search }],
    // The queryFn is the async function that fetches the data
    queryFn: () => orderService.getAll({ page, limit, search }),
    // This query will only run if auth is not loading AND the user is authenticated
    enabled: !isAuthLoading && isAuthenticated,
    // This provides the server-fetched data to prevent a loading flicker on the first visit
    initialData: initialData,
  });
}

/**
 * Hook for fetching a single order by its ID.
 */
export function useOrder(orderId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Order>({
    queryKey: [...ORDERS_QUERY_KEY, orderId],
    queryFn: () => orderService.getById(orderId!), // The '!' is safe because of the `enabled` flag
    // The query will only run if auth is ready and an orderId is provided
    enabled: !isAuthLoading && isAuthenticated && !!orderId,
  });
}

/**
 * Hook for creating a new manual order.
 * Returns a `mutate` function to trigger the creation.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      toast.success(`Order #${newOrder.orderNumber} created successfully.`);
      // Invalidate all order list queries to trigger a refetch and show the new order
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order.");
    },
  });
}

/**
 * Hook for updating an order's fulfillment status.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { orderId: string; status: OrderStatus }) =>
      orderService.updateStatus(variables.orderId, variables.status),
    onSuccess: (updatedOrder) => {
      toast.success(`Order #${updatedOrder.orderNumber}'s status has been updated.`);
      // Invalidate both the main list and the specific order's cache for immediate UI update
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, updatedOrder.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status.");
    },
  });
}

/**
 * Hook for updating an order's payment status.
 */
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

/**
 * Hook for deleting a single order.
 */
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

/**
 * Hook for deleting multiple orders in a batch.
 */
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