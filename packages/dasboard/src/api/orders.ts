// src/api/orders.ts
import { CreateOrderDto, Order, OrderStatus, PaymentStatus } from '@/types/orders';
// import { apiClient } from './client';

// --- GET Requests ---

/**
 * Fetches all orders.
 */
export async function getAllOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/v1/dashboard/orders');
  return response.data;
}

/**
 * Fetches a single order by its ID.
 * @param orderId The ID of the order to fetch.
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/v1/dashboard/orders/${orderId}`);
  return response.data;
}

// --- POST Request ---

/**
 * Creates a new order.
 * @param orderData The data for the new order, matching the CreateOrderDto.
 */
export async function createOrder(orderData: CreateOrderDto): Promise<Order> {
  const response = await apiClient.post<Order>('/v1/dashboard/orders', orderData);
  return response.data;
}

// --- PATCH Requests ---

/**
 * Updates the status of a specific order.
 * @param orderId The ID of the order to update.
 * @param newStatus The new status for the order.
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
  // The endpoint is `/v1/dashboard/orders/:id/status`
  const response = await apiClient.patch<Order>(`/v1/dashboard/orders/${orderId}/status`, { status: newStatus });
  return response.data;
}

/**
 * Updates the payment status of a specific order.
 * @param orderId The ID of the order to update.
 * @param newPaymentStatus The new payment status for the order.
 */
export async function updatePaymentStatus(orderId: string, newPaymentStatus: PaymentStatus): Promise<Order> {
    // The endpoint is `/v1/dashboard/orders/:id/payment-status`
    const response = await apiClient.patch<Order>(`/v1/dashboard/orders/${orderId}/payment-status`, { paymentStatus: newPaymentStatus });
    return response.data;
}

// --- DELETE Request ---

/**
 * Deletes an order.
 * @param orderId The ID of the order to delete.
 */
export async function deleteOrder(orderId: string): Promise<void> {
    // Assuming a DELETE endpoint exists at /v1/dashboard/orders/:id
    await apiClient.delete(`/v1/dashboard/orders/${orderId}`);
}