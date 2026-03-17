import { Order } from './orders'; 

export interface Address {
  id: string;
  firstName: String;
  lastName: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  addressLine1: string;
  addressLine2: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  createdAt: string; 
  updatedAt: string;
  addresses?: Address[];

  orders?: Order[];

  _count?: {
    orders: number;
  };
}

export interface CustomerDetails extends Customer {
  // Aggregate stats often used in the "Customer Profile" page
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
}

export interface CreateCustomerDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;