import { apiClient } from "@/lib/api-client";

export class OrderService {
  async getOrders(email: string): Promise<any[]> {
    if (!email) return [];
    const response = await apiClient.get<any>("/api/v1/storefront/orders", { email });
    return response;
  }
}

export const orderService = new OrderService(); 