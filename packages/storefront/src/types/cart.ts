export interface CartItem {
  id: string;
  name: string;
  price: number;
  slug: string;
  description: string;
  image?: string;
  quantity: number;
  inventoryQuantity: number;
  variantId?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
