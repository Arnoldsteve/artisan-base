export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;       
  isFeatured: boolean;   
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
