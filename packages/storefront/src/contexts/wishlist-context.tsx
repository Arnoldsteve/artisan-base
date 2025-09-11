"use client";

import { WishlistContextType, WishlistItem } from "@/types/wishlist";
import React, { createContext, useContext, useReducer, useEffect } from "react";


const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

function wishlistReducer(state: WishlistItem[], action: any): WishlistItem[] {
  switch (action.type) {
    case "ADD":
      if (state.find((item) => item.id === action.item.id)) return state;
      return [...state, action.item];
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "CLEAR":
      return [];
    case "SET":
      return action.items;
    default:
      return state;
  }
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(wishlistReducer, [], (init) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist");
      return stored ? JSON.parse(stored) : init;
    }
    return init;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        dispatch({ type: "SET", items: JSON.parse(stored) });
      }
    }
  }, []);

  const addToWishlist = (item: WishlistItem) => dispatch({ type: "ADD", item });
  const removeFromWishlist = (id: string) => dispatch({ type: "REMOVE", id });
  const isInWishlist = (id: string) => state.some((item) => item.id === id);
  const clearWishlist = () => dispatch({ type: "CLEAR" });

  return (
    <WishlistContext.Provider
      value={{
        items: state,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlistContext must be used within WishlistProvider");
  return ctx;
}
