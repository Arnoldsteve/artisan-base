import { apiClient } from "@/lib/api-client";
import { CheckoutPayload, OrderResponse } from "@/types/checkout";
import { Order } from "@/types/orders";
import { ApiResponse } from "@/types/shared";

/**
 * SOLID Principle: Single Responsibility
 * This service handles the lifecycle of an Order from the Storefront side.
 * It supports both Global Marketplace and Isolated Storefront contexts.
 */
export class OrderService {
  /**
   * ACTION: Place Order (The Checkout Handshake)
   * millions of users: This endpoint takes the Multi-Vendor payload and 
   * returns a list of Order IDs and a Payment Reference.
   */
  async placeOrder(payload: CheckoutPayload): Promise<OrderResponse> {
    // Note: If x-tenant-id header is present, the backend treats this as an isolated order.
    // If missing, it processes as a global marketplace multi-vendor checkout.
    return apiClient.post<OrderResponse>("/orders", payload);
  }

  /**
   * PUBLIC: Get a specific order by ID.
   * Useful for the confirmation page and guest tracking.
   */
  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  }

  /**
   * AUTHENTICATED: Get order history for a specific customer.
   */
  async getByCustomer(customerId: string): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      `/orders/customer/${customerId}`
    );
    return response.data;
  }

  /**
   * GLOBAL: List all public orders (if enabled on backend).
   * millions of users: Delegated to the Enterprise Pagination engine.
   */
  async getAll(params: any = {}): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>("/orders", params);
    return response.data;
  }
}

export const orderService = new OrderService();