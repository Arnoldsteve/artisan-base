import { createServerApiClient } from "@/lib/server-api";
import { CategoriesView } from "./components/categories-view";
import { Category } from "@/types/categories";
import { PaginatedResponse } from "@/types/shared";
import { PageHeader } from "@/components/shared/page-header";

export default async function ProductCategoriesPage() {
  let initialData: PaginatedResponse<Category>;

  try {
    const serverApi = await createServerApiClient();

    // Fetch categories with product counts
    initialData = await serverApi.get<
      PaginatedResponse<Category & { _count?: { products: number } }>
    >("/dashboard/categories", { page: 1, limit: 10 });
    // console.log("Fetched initial categories on server:", initialData);
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

  return (
    <>
      <PageHeader title="Product Categories" />
      <div className="p-4 md:p-8 lg:p-10">
        <CategoriesView initialCategoryData={initialData} />
      </div>
    </>
  );
}
