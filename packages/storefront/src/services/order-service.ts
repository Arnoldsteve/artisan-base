import { apiClient } from "@/lib/api-client";
import { CartItem } from "@/types/cart";
import type {
  Customer,
  ShippingAddress,
  ShippingOption,
  PaymentMethod,
} from "@/types/checkout";

export class OrderService {
  async getOrders(email: string): Promise<any[]> {
    if (!email) return [];
    const response = await apiClient.get<any>("/api/v1/storefront/orders", {
      email,
    });
    return response;
  }

  async getOrder(orderId: string, email?: string): Promise<any> {
    console.log("Fetching order with ID:", orderId, "for email:", email);
    if (!orderId) return null;
    const response = await apiClient.get<any>(
      `/api/v1/storefront/orders/${orderId}`,
      { email }
    );
    return response;
  }

  async createOrder(payload: {
    customer: Customer;
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    shippingOption?: ShippingOption;
    paymentMethod?: PaymentMethod;
    items: CartItem[];
    currency?: string;
    notes?: string;
    shippingAmount?: number;
  }): Promise<any> {
    const response = await apiClient.post<any>(
      "/api/v1/storefront/orders",
      payload
    );
    return response;
  }
}

export const orderService = new OrderService();
