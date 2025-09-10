// This file contains types that are shared across different modules
// of the dashboard and reflect the backend's ENUMs.

export enum DashboardUserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

// You can add other enums here as you need them
// export enum OrderStatus { ... }


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