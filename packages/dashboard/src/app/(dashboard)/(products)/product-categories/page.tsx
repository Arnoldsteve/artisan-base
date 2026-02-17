import { createServerApiClient } from "@/lib/server-api";
import { CategoriesWrapper } from "./components/categories-wrapper";
import { Category } from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";

export default function ProductCategoriesPage() {
  
  return <CategoriesWrapper initialCategoryData={undefined} />;
}
