export class CreateStorefrontOrderDto {
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any>;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  notes?: string;
}
