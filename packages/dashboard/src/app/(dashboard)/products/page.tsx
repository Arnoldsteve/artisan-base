import { createServerApiClient } from "@/lib/server-api";
import { ProductsView } from "./components/products-view";
import { PaginatedResponse } from "@/types/shared";
import { Product } from "@/types/products";
import { PageHeader } from "@/components/shared/page-header";

export default async function ProductsPage() {
  let initialData: PaginatedResponse<Product>;

  try {
    // --- THIS IS THE FIX ---
    // 1. First, `await` the factory function to get the resolved client instance.
    const serverApi = await createServerApiClient();

    // 2. Now, you can safely call the `.get()` method on that instance.
    initialData = await serverApi.get<PaginatedResponse<Product>>(
      "/dashboard/products",
      { page: 1, limit: 10 }
    );
    console.log("Fetched initial products on server:", initialData);
  } catch (err) {
    console.error("Failed to fetch initial products on server:", err);
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
      <PageHeader title="Products" />

      <div className="p-4 md:p-8 lg:p-10">
        <ProductsView initialData={initialData} />
      </div>
    </>
  );
}
