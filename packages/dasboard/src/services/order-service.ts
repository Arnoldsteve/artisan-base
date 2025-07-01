import {
  CreateOrderDto,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { IOrderRepository, orderRepository } from "@/services/order-repository";

/**
 * OrderService encapsulates business logic for orders, using a repository for data access.
 */
export class OrderService {
  constructor(private repo: IOrderRepository = orderRepository) {}

  /**
   * Gets all orders.
   */
  async getAll(): Promise<Order[]> {
    return this.repo.getAll();
  }

  /**
   * Gets an order by ID.
   */
  async getById(orderId: string): Promise<Order> {
    return this.repo.getById(orderId);
  }

  /**
   * Creates a new order.
   * @param orderData - The order data to create.
   * @returns The created order.
   */
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    return this.repo.create(orderData);
  }

  /**
   * Updates the status of an order.
   * @param orderId - The order ID.
   * @param newStatus - The new status.
   * @returns The updated order.
   */
  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    return this.repo.updateStatus(orderId, newStatus);
  }

  /**
   * Updates the payment status of an order.
   */
  async updatePaymentStatus(
    orderId: string,
    newPaymentStatus: PaymentStatus
  ): Promise<Order> {
    return this.repo.updatePaymentStatus(orderId, newPaymentStatus);
  }

  /**
   * Deletes an order.
   */
  async deleteOrder(orderId: string): Promise<void> {
    return this.repo.delete(orderId);
  }

  /**
   * Batch deletes orders.
   */
  async batchDeleteOrders(orderIds: string[]): Promise<void> {
    return this.repo.batchDelete(orderIds);
  }
}

export const orderService = new OrderService();
