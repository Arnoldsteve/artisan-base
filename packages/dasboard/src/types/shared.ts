// ============================================================================
// API Response Types
// ============================================================================

/**
 * A generic type for paginated API responses.
 * Example: PaginatedResponse<Product>
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        prev: number | null;
        next: number | null;
    }
}