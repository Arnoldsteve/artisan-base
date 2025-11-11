import { createServerApiClient } from "@/lib/server-api";
import { CategoriesWrapper } from "./components/categories-wrapper";
import { Category } from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";

export default async function ProductCategoriesPage() {
  let initialData: PaginatedResponse<Category>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<
      PaginatedResponse<Category & { _count?: { products: number } }>
    >("/dashboard/categories", { page: 1, limit: 10 });
  } catch (err) {
    console.error("Failed to fetch initial categories on server:", err);
    initialData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        prev: null,
        next: null,
      },
    };
  }

  return <CategoriesWrapper initialCategoryData={initialData} />;
}
