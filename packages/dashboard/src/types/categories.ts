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

export interface CreateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
