/**
 * SOLID Principle: Single Responsibility
 * This file contains the universal data contracts for the entire storefront.
 */

/**
 * Standard wrapper for all non-paginated API responses.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Metadata for cursor-based pagination. 
 * Essential for "Load More" and "Infinite Scroll" in high-scale storefronts.
 */
export interface CursorPaginationMeta {
  limit: number;
  nextCursor?: string | null;
  hasMore: boolean;
}

/**
 * Standard wrapper for all paginated lists.
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: CursorPaginationMeta;
  success: boolean;
  message?: string;
}

/**
 * Global Sort Direction
 */
export type SortOrder = "asc" | "desc";

/**
 * Error structure for consistent UI feedback
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error: string;
}