import { apiClient } from "@/lib/api-client";

export class OrderService {
  async getOrders(email: string): Promise<any[]> {
    if (!email) return [];
    const response = await apiClient.get<any>("/api/v1/storefront/orders", {
      email,
    });
    return response;
  }

  async getOrder(orderId: string, email?: string): Promise<any> {
    console.log("Fetching order with ID:", orderId, "for email:", email);
    if (!orderId) return null;
    const response = await apiClient.get<any>(
      `/api/v1/storefront/orders/${orderId}`,
      { email }
    );
    return response;
  }
}

export const orderService = new OrderService();
