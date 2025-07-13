import { useMemo } from "react";
import { useProducts } from "./use-products";
import { Product } from "@/types";

interface RecommendationResult {
  recommendations: Product[];
  isLoading: boolean;
  error: unknown;
}

function getTagSimilarity(tagsA: string[], tagsB: string[]): number {
  if (!tagsA.length || !tagsB.length) return 0;
  const setA = new Set(tagsA);
  const setB = new Set(tagsB);
  const intersection = new Set([...setA].filter((t) => setB.has(t)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function getPriceScore(priceA: number, priceB: number): number {
  // 1 if within 50%, else 0
  if (!priceA || !priceB) return 0;
  const min = priceA * 0.5;
  const max = priceA * 1.5;
  return priceB >= min && priceB <= max ? 1 : 0;
}

function getPopularityScore(rating: number, reviewCount: number): number {
  // Normalize popularity (0-1) based on rating * reviewCount
  return Math.min(1, (rating * reviewCount) / 500); // 500 is arbitrary for normalization
}

export function useRecommendations(productId: string): RecommendationResult {
  const { data: productsData, isLoading, error } = useProducts();

  const recommendations = useMemo(() => {
    if (!productsData || !productId) return [];
    const allProducts = productsData.data || productsData;
    const current = allProducts.find((p) => p.id === productId);
    if (!current) return [];

    // Score all other products
    let scored = allProducts
      .filter((p) => p.id !== productId && p.isActive)
      .map((p) => {
        // Category match
        const categoryScore = p.category === current.category ? 1 : 0;
        // Tag similarity
        const tagScore = getTagSimilarity(p.tags || [], current.tags || []);
        // Price range
        const priceScore = getPriceScore(current.price, p.price);
        // Popularity
        const popScore = getPopularityScore(p.rating, p.reviewCount);
        // Weighted sum
        const score =
          categoryScore * 0.4 +
          tagScore * 0.3 +
          priceScore * 0.2 +
          popScore * 0.1;
        return { ...p, _score: score };
      })
      .filter((p) => p._score > 0.3)
      .sort((a, b) => b._score - a._score);

    // Fallback logic
    if (scored.length < 4) {
      // Add more from same category
      const sameCategory = allProducts.filter(
        (p) =>
          p.id !== productId &&
          p.isActive &&
          p.category === current.category &&
          !scored.some((s) => s.id === p.id)
      );
      scored = [...scored, ...sameCategory];
    }
    if (scored.length < 4) {
      // Add most popular
      const popular = allProducts
        .filter((p) => p.id !== productId && p.isActive)
        .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
        .filter((p) => !scored.some((s) => s.id === p.id));
      scored = [...scored, ...popular];
    }
    // Prioritize in-stock
    scored = [
      ...scored.filter((p) => p.inventoryQuantity > 0),
      ...scored.filter((p) => p.inventoryQuantity === 0),
    ];
    // Mix price ranges
    const priceSorted = [
      ...scored.filter((p) => p.price <= current.price),
      ...scored.filter((p) => p.price > current.price),
    ];
    // Remove duplicates, keep top 8
    const unique = [];
    const seen = new Set();
    for (const p of priceSorted) {
      if (!seen.has(p.id)) {
        unique.push(p);
        seen.add(p.id);
      }
      if (unique.length >= 8) break;
    }
    return unique;
  }, [productsData, productId]);

  return { recommendations, isLoading, error };
}
