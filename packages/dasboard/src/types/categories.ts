// File: packages/dashboard/src/types/categories.ts

// ============================================================================
// Main Entity Types (Data received from the API)
// ============================================================================

/**
 * The main Category type. This should match the shape of the data
 * returned from your NestJS API. Dates are returned as ISO strings.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;       // <-- useful for dashboard filters
  isFeatured: boolean;     // <-- e.g., highlight certain categories
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Data Transfer Objects (DTOs) (Data sent to the API)
// ============================================================================

/**
 * Data Transfer Object for creating a new category.
 */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Data Transfer Object for updating an existing category.
 */
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

// ============================================================================
// API Response Types
// ============================================================================

/**
 * A generic type for paginated API responses.
 * Example: PaginatedResponse<Category>
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
  };
}
