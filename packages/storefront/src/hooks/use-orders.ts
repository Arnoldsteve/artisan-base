import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import type { CartItem } from "@/types/cart";
import type { Customer, ShippingAddress, PaymentMethod, Order } from "@/types/checkout";

type CreateOrderPayload = {
  customer?: Customer;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod?: PaymentMethod;
  items: CartItem[];
  currency: "KES"; // or other enum value
  notes?: string;
  shippingAmount?: number;
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
      // Transform payload to match backend DTO
      const transformed = {
        customer: payload.customer,
        shippingAddress: payload.shippingAddress,
        billingAddress: payload.billingAddress,
        items: payload.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          ...(item.variantId ? { variantId: item.variantId } : {}),
        })),
        paymentMethod: payload.paymentMethod?.code, // must match PaymentProvider enum
        currency: payload.currency,
        notes: payload.notes,
        shippingAmount: payload.shippingAmount,
      };

      const response = await orderService.createOrder(transformed);
      return response.order as Order;
    },
    onSuccess: (order) => {
      queryClient.setQueryData(["orders", email], (old: Order[] | undefined) =>
        old ? [order, ...old] : [order]
      );
    },
  });

  return {
    ...ordersQuery,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    createError: createOrderMutation.error?.message || null,
  };
}
