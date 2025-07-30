import { apiClient } from "@/lib/client-api"; 
import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";

/**
 * OrderService directly handles API communication for dashboard order management.
 */
export class OrderService {
  /**
   * Gets all orders with optional pagination.
   */
  async getAll(params?: { page?: number; limit?: number }): Promise<Order[]> {
    return apiClient.get<Order[]>("/api/v1/dashboard/orders", params);
  }

  /**
   * Gets a single order by its ID.
   */
  async getById(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/api/v1/dashboard/orders/${orderId}`);
  }

  /**
   * Creates a new manual order.
   * @param orderData - The order data to create.
   * @returns The newly created order.
   */
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    return apiClient.post<Order>("/api/v1/dashboard/orders", orderData);
  }

  /**
   * Updates the fulfillment status of an order.
   * @param orderId - The ID of the order to update.
   * @param newStatus - The new fulfillment status.
   * @returns The updated order.
   */
  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    // NOTE: Assumes your API endpoint is PATCH /.../orders/:id/status
    return apiClient.patch<Order>(`/api/v1/dashboard/orders/${orderId}/status`, {
      status: newStatus,
    });
  }

  /**
   * Updates the payment status of an order.
   * @param orderId - The ID of the order to update.
   * @param newPaymentStatus - The new payment status.
   * @returns The updated order.
   */
  async updatePaymentStatus(
    orderId: string,
    newPaymentStatus: PaymentStatus
  ): Promise<Order> {
    // NOTE: Assumes your API endpoint is PATCH /.../orders/:id/payment-status
    return apiClient.patch<Order>(
      `/api/v1/dashboard/orders/${orderId}/payment-status`,
      { paymentStatus: newPaymentStatus }
    );
  }

  /**
   * Deletes a single order.
   */
  async deleteOrder(orderId: string): Promise<void> {
    await apiClient.delete(`/api/v1/dashboard/orders/${orderId}`);
  }

  /**
   * Deletes multiple orders in a batch operation.
   */
  async batchDeleteOrders(orderIds: string[]): Promise<void> {
    // NOTE: Assumes your API supports a batch delete endpoint like this.
    // Using POST is common for batch operations with a request body.
    await apiClient.post("/api/v1/dashboard/orders/batch-delete", {
      ids: orderIds,
    });
  }
}

export const orderService = new OrderService();