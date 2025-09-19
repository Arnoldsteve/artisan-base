// File: packages/dasboard/src/services/order-service.ts

import { apiClient } from "@/lib/client-api"; 
import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { PaginatedResponse } from "@/types/shared";

/**
 * OrderService directly handles API communication for dashboard order management.
 */
export class OrderService {
  /**
   * Gets all orders with optional pagination and search.
   */
  async getAll(params?: { 
    page?: number; 
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Order>> { // <-- 2. UPDATE THE RETURN TYPE
    // 3. UPDATE THE GENERIC and FIX THE PATH
    return apiClient.get<PaginatedResponse<Order>>("/dashboard/orders", params);
  }

  /**
   * Gets a single order by its ID.
   */
  async getById(orderId: string): Promise<Order> {
    // FIX THE PATH
    return apiClient.get<Order>(`/dashboard/orders/${orderId}`);
  }

  /**
   * Creates a new manual order.
   */
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // FIX THE PATH
    return apiClient.post<Order>("/dashboard/orders", orderData);
  }

  /**
   * Updates the fulfillment status of an order.
   */
  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    // FIX THE PATH
    return apiClient.patch<Order>(`/dashboard/orders/${orderId}/status`, {
      status: newStatus,
    });
  }

  /**
   * Updates the payment status of an order.
   */
  async updatePaymentStatus(
    orderId: string,
    newPaymentStatus: PaymentStatus
  ): Promise<Order> {
    // FIX THE PATH
    return apiClient.patch<Order>(
      `/dashboard/orders/${orderId}/payment-status`,
      { paymentStatus: newPaymentStatus }
    );
  }

  /**
   * Deletes a single order.
   */
  async deleteOrder(orderId: string): Promise<void> {
    // FIX THE PATH
    await apiClient.delete(`/dashboard/orders/${orderId}`);
  }

  /**
   * Deletes multiple orders in a batch operation.
   */
  async batchDeleteOrders(orderIds: string[]): Promise<void> {
    // FIX THE PATH
    await apiClient.post("/dashboard/orders/batch-delete", {
      ids: orderIds,
    });
  }
}

export const orderService = new OrderService();