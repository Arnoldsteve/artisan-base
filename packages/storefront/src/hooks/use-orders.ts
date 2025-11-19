import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import type { CartItem } from "@/types/cart";
import type { Customer, ShippingAddress, ShippingOption, PaymentMethod, Order } from "@/types/checkout";

type CreateOrderPayload = {
  customer: Customer;
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  items: CartItem[];
};

export function useOrders(email: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch orders
  const ordersQuery = useQuery({
    queryKey: ["orders", email],
    queryFn: () => (email ? orderService.getOrders(email) : Promise.resolve([])),
    enabled: !!email,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await orderService.createOrder(payload);
      return response.order as Order;
    },
    onSuccess: (order) => {
      // Update the orders cache to include the new order
      queryClient.setQueryData(["orders", email], (old: Order[] | undefined) =>
        old ? [order, ...old] : [order]
      );
    },
  });

  return {
    ...ordersQuery,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending, 
    createError: createOrderMutation.error,
  };
}
