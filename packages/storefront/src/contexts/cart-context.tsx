"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useMemo,
} from "react";
import { CartItem, CartContextType } from "@/types/cart";
import { CartConfirmationModal } from "@/components/cart/cart-confirmation-modal";

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "CLEAR_TENANT"; tenantId: string }
  | { type: "HYDRATE"; items: CartItem[] };

interface State {
  items: CartItem[];
}

const initialState: State = { items: [] };

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      /**
       * TOP 1% DEFENSIVE LOGIC: 
       * Ensures state always maintains the { items: [] } structure
       */
      return { 
        items: Array.isArray(action.items) ? action.items : [] 
      };

    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
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
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "UPDATE":
      return {
        items: state.items.map((i) =>
          i.id === action.id
            ? {
                ...i,
                quantity: Math.max(1, Math.min(action.quantity, i.inventoryQuantity)),
              }
            : i
        ),
      };

    case "CLEAR_TENANT":
      return { items: state.items.filter((i) => i.tenantId !== action.tenantId) };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<CartItem | null>(null);

  // 1. HYDRATION FIX: Safely parse and extract the array
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If we saved 'state', we must extract 'items'. If we saved just an array, use it.
        const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
        dispatch({ type: "HYDRATE", items });
      } catch (e) {
        console.error("Cart hydration failed:", e);
        dispatch({ type: "HYDRATE", items: [] });
      }
    }
    setIsHydrated(true);
  }, []);

  // 2. PERSISTENCE: Sync to local storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // --- Methods ---
  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD", item });
    setLastAddedProduct(item);
    setIsModalOpen(true);
  };

  const removeFromCart = (id: string) => dispatch({ type: "REMOVE", id });
  
  const updateQuantity = (id: string, quantity: number) => 
    dispatch({ type: "UPDATE", id, quantity });

  const clearCart = () => dispatch({ type: "CLEAR" });

  const clearTenantItems = (tenantId: string) => 
    dispatch({ type: "CLEAR_TENANT", tenantId });

  // --- Selectors ---
  const getTotalPrice = () =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getTotalItems = () =>
    state.items.reduce((sum, i) => sum + i.quantity, 0);

  const getTenantTotal = (tenantId: string) =>
    state.items
      .filter((i) => i.tenantId === tenantId)
      .reduce((sum, i) => sum + i.price * i.quantity, 0);

  /**
   * Memoize value to prevent unnecessary re-renders of the whole app tree
   */
  const value = useMemo(() => ({
    items: state.items,
    isHydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearTenantItems,
    getTotalPrice,
    getTotalItems,
    getTenantTotal,
  }), [state.items, isHydrated]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={lastAddedProduct?.name}
        onGoToCart={() => {
          setIsModalOpen(false);
          window.location.href = "/cart";
        }}
      />
    </CartContext.Provider>
  );
};

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}