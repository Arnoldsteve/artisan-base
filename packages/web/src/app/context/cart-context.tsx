'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  // We can add removeFromCart, clearCart, etc. later
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If item already exists, just increase quantity
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Otherwise, add new item with quantity of 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // We can show a toast message here later
    console.log(`Added ${product.name} to cart.`);
  };

  const value = { cartItems, addToCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}