export interface ShopFilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number | null;
}