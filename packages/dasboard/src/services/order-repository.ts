import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import * as orderApi from "@/api/orders";

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

export class OrderRepository implements IOrderRepository {
  async getAll() {
    return orderApi.getAllOrders();
  }
  async getById(orderId: string) {
    return orderApi.getOrderById(orderId);
  }
  async create(orderData: CreateOrderDto) {
    return orderApi.createOrder(orderData);
  }
  async updateStatus(orderId: string, newStatus: OrderStatus) {
    return orderApi.updateOrderStatus(orderId, newStatus);
  }
  async updatePaymentStatus(orderId: string, newPaymentStatus: PaymentStatus) {
    return orderApi.updatePaymentStatus(orderId, newPaymentStatus);
  }
  async delete(orderId: string) {
    return orderApi.deleteOrder(orderId);
  }
  async batchDelete(orderIds: string[]) {
    // If backend supports batch, use it. Otherwise, fallback to Promise.all
    await Promise.all(orderIds.map((id) => orderApi.deleteOrder(id)));
  }
}

export const orderRepository = new OrderRepository();
