import axios, { AxiosError } from "axios";
import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";

const bffApi = axios.create({
  baseURL: "/api",
});

const handleError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response) {
    throw new Error(error.response.data.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

// --- GET Requests ---
export async function getAllOrders(): Promise<Order[]> {
  try {
    // Calls GET /api/dashboard/orders
    const response = await bffApi.get("/dashboard/orders");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch orders.");
  }
}

export async function getOrderById(orderId: string): Promise<Order> {
  try {
    // Calls GET /api/dashboard/orders/{id}
    const response = await bffApi.get(`/dashboard/orders/${orderId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch order.");
  }
}

// --- POST Request ---
export async function createOrder(orderData: CreateOrderDto): Promise<Order> {
  try {
    // Calls POST /api/dashboard/orders
    const response = await bffApi.post("/dashboard/orders", orderData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create order.");
  }
}

// --- PATCH Requests ---
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<Order> {
  try {
    // Calls PATCH /api/dashboard/orders/{id}/status
    const response = await bffApi.patch(`/dashboard/orders/${orderId}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update order status.");
  }
}

export async function updatePaymentStatus(
  orderId: string,
  newPaymentStatus: PaymentStatus
): Promise<Order> {
  try {
    // Calls PATCH /api/dashboard/orders/{id}/payment-status
    const response = await bffApi.patch(
      `/dashboard/orders/${orderId}/payment-status`,
      { paymentStatus: newPaymentStatus }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update payment status.");
  }
}

// --- DELETE Request ---
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    // Calls DELETE /api/dashboard/orders/{id}
    await bffApi.delete(`/dashboard/orders/${orderId}`);
  } catch (error) {
    handleError(error, "Failed to delete order.");
  }
}

// DEPRECATED: API logic moved to services/order-repository.ts for SRP and testability.
export * from "@/types/orders";
