// In packages/web/src/lib/types.ts

export interface Store {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  store: Store | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // Prisma Decimal comes as a string
  imageUrl: string | null;
  createdAt: string;
}