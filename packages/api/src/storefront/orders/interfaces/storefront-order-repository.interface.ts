import { CreateStorefrontOrderDto } from '../dto/create-storefront-order.dto';
import { GetStorefrontOrdersDto } from '../dto/get-storefront-orders.dto';
import { Order, Payment } from '../../../../generated/tenant'; // Import Prisma types for better type safety

export interface IStorefrontOrderRepository {
  /**
   * Creates a new order in the database.
   */
  create(dto: CreateStorefrontOrderDto): Promise<Order>;

  /**
   * Retrieves a list of orders for a specific customer.
   */
  getOrders(query: GetStorefrontOrdersDto): Promise<Order[]>;

  /**
   * Retrieves a single order by its ID for a specific customer.
   */
  getOrder(id: string, query: GetStorefrontOrdersDto): Promise<Order | null>;

  /**
   * Finds an order based on the provider's temporary checkout ID.
   * This is crucial for linking webhooks back to the original order.
   */
  findOrderByCheckoutRequestId(checkoutRequestId: string): Promise<Order | null>;

  /**
   * Creates a new payment record associated with an order.
   */
  createPayment(paymentData: any): Promise<Payment>; // Use a more specific DTO in the future if needed

  /**
   * Updates the status and/or payment status of an existing order.
   */
  updateOrderStatus(
    orderId: string,
    data: { status?: Order['status']; paymentStatus?: Order['paymentStatus'] },
  ): Promise<Order>;
}