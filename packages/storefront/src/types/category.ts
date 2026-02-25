/**
 * SOLID Principle: Single Responsibility
 * Defines the Organizational Category entity for the Storefront.
 */

export interface Category {
  id: string;
  tenantId: string; // Critical for identifying which store owns this category
  name: string;
  slug: string;
  description?: string;
  
  // Enterprise Scale: Pre-aggregated counts from the backend
  _count?: {
    products: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Data Transfer Object for category filtering
 */
export interface CategoryFilters {
  search?: string;
  limit?: number;
  cursor?: string;
}

/**
 * DTO for creating categories (Dashboard use, but kept here for consistency)
 */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
}

/**
 * DTO for updating categories
 */
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}