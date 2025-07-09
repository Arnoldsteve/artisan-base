"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, CartContextType } from "@/types/cart";

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; quantity: number }
  | { type: "CLEAR" };

interface State {
  items: CartItem[];
}

const initialState: State = { items: [] };

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.item.id
              ? {
                  ...i,
                  quantity: Math.min(
                    i.quantity + action.item.quantity,
                    i.inventoryQuantity
                  ),
                }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.id) };
    case "UPDATE":
      return {
        items: state.items.map(i =>
          i.id === action.id
            ? {
                ...i,
                quantity: Math.max(
                  1,
                  Math.min(action.quantity, i.inventoryQuantity)
                ),
              }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : init;
    }
    return init;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD", item });
  };
  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE", id });
  };
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE", id, quantity });
  };
  const clearCart = () => {
    dispatch({ type: "CLEAR" });
  };
  const getTotalPrice = () =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getTotalItems = () =>
    state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
} 