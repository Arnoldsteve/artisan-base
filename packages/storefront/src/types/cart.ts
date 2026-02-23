import { Product } from "./product";

/**
 * SOLID Principle: Single Responsibility
 * Defines the contract for the Marketplace shopping experience.
 */

export interface CartItem {
  id: string;                // Product or Variant ID
  tenantId: string;          // CRITICAL: Identifies the merchant owner
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
  inventoryQuantity: number;
  
  // Enterprise Standard: Store metadata for UI grouping
  tenantName?: string;
  tenantSubdomain?: string;
}

export interface CartContextType {
  items: CartItem[];
  
  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearTenantItems: (tenantId: string) => void; // Added for per-store checkout
  
  // Computed (Millions of users: Calculated on the fly)
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTenantTotal: (tenantId: string) => number;
}