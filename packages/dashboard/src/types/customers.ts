import { Decimal } from 'decimal.js';
import { Order } from './orders'; 
import { PaginatedResponse } from './shared';

export interface CustomerAddress {
  id: string;
  type: string; // e.g., 'shipping', 'billing'
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string ;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string ;
  lastName?: string ;
  phone?: string ;
  createdAt: string; 
  updatedAt: string; 
  addresses?: CustomerAddress[];
  orders?: Order[]; 
}

export interface CustomerDetails extends Customer {
  addresses: CustomerAddress[];
  orders: Order[];
  
  _stats?: {
    totalSpent: Decimal;
    orderCount: number;
  };
}

export interface CreateCustomerDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;