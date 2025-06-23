// ============ USER ============//

export interface UserProfile {
  id: string;
  email: string;
  store: Store | null;
}

// ============ STORE ============//
export interface Store {
  id: string;
  name: string;
}

// ============ PRODUCTS ============//
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // Prisma Decimal comes as a string
  imageUrl: string | null;
  createdAt: string;
}

// ============ ORDERS ============//

export interface OrderItem {
  id: string;
  quantity: number;
  product: Product; // The nested product details
}

export interface Order {
  id: string;
  customerEmail: string;
  totalAmount: string; // Prisma Decimal comes as a string
  createdAt: string;
  items: OrderItem[];
}