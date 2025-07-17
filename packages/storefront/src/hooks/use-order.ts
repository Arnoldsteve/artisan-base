import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";

export function useOrder(orderId: string | null, email?: string) {
  return useQuery({
    queryKey: ["order", orderId, email],
    queryFn: () =>
      orderId && email
        ? orderService.getOrder(orderId, email)
        : Promise.resolve(null),
    enabled: !!orderId && !!email,
  });
}
