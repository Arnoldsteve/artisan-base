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

export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  getById(orderId: string): Promise<Order>;
  create(orderData: CreateOrderDto): Promise<Order>;
  updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order>;
  updatePaymentStatus(
    orderId: string,
    newPaymentStatus: PaymentStatus
  ): Promise<Order>;
  delete(orderId: string): Promise<void>;
  batchDelete(orderIds: string[]): Promise<void>;
}

export const orderRepository: IOrderRepository = {
  async getAll() {
    try {
      const response = await bffApi.get("/dashboard/orders");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch orders.");
    }
  },
  async getById(orderId) {
    try {
      const response = await bffApi.get(`/dashboard/orders/${orderId}`);
      console.log("order response", response.data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch order.");
    }
  },
  async create(orderData) {
    try {
      const response = await bffApi.post("/dashboard/orders", orderData);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to create order.");
    }
  },
  async updateStatus(orderId, newStatus) {
    try {
      const response = await bffApi.patch(
        `/dashboard/orders/${orderId}/status`,
        { status: newStatus }
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update order status.");
    }
  },
  async updatePaymentStatus(orderId, newPaymentStatus) {
    try {
      const response = await bffApi.patch(
        `/dashboard/orders/${orderId}/payment-status`,
        { paymentStatus: newPaymentStatus }
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update payment status.");
    }
  },
  async delete(orderId) {
    try {
      await bffApi.delete(`/dashboard/orders/${orderId}`);
    } catch (error) {
      handleError(error, "Failed to delete order.");
    }
  },
  async batchDelete(orderIds) {
    try {
      await Promise.all(
        orderIds.map((id) => bffApi.delete(`/dashboard/orders/${id}`))
      );
    } catch (error) {
      handleError(error, "Failed to batch delete orders.");
    }
  },
};
