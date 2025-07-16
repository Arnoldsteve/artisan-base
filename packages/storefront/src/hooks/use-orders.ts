import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";

export function useOrders(email: string | undefined) {
  return useQuery({
    queryKey: ["orders", email],
    queryFn: () =>
      email ? orderService.getOrders(email) : Promise.resolve([]),
    enabled: !!email,
  });
}
