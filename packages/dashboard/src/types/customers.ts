import { Order } from './orders'; 

export interface Customer {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  createdAt: string; 
  updatedAt: string;
  
  // Relations (Optional for list views)
  orders?: Order[];

  // Computed stats for the dashboard
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