// src/types/wishlist.ts

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  // images?: { url: string }[];
  category: string;
  slug?: string;
  description?: string;
  inventoryQuantity: number;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}
