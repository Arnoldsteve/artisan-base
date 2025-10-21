import { apiClient } from "@/lib/client-api"; 
import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { PaginatedResponse } from "@/types/shared";

export class OrderService {
  /**
   * Gets all orders with optional pagination and search.
   */
  async getAll(params?: { 
    page?: number; 
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Order>> { 
    return apiClient.get<PaginatedResponse<Order>>("/dashboard/orders", params);
  }

   async getById(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/dashboard/orders/${orderId}`);
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    console.log("Creating order from service with data:", orderData);
    return apiClient.post<Order>("/dashboard/orders", orderData);
  }


  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    return apiClient.patch<Order>(`/dashboard/orders/${orderId}/status`, {
      status: newStatus,
    });
  }


  async updatePaymentStatus(
    orderId: string,
    newPaymentStatus: PaymentStatus
  ): Promise<Order> {
    return apiClient.patch<Order>(
      `/dashboard/orders/${orderId}/payment-status`,
      { paymentStatus: newPaymentStatus }
    );
  }

  async deleteOrder(orderId: string): Promise<void> {
    await apiClient.delete(`/dashboard/orders/${orderId}`);
  }

  async batchDeleteOrders(orderIds: string[]): Promise<void> {
    await apiClient.post("/dashboard/orders/batch-delete", {
      ids: orderIds,
    });
  }
}

export const orderService = new OrderService();