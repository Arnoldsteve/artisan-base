import { createServerApiClient } from "@/lib/server-api";
import { ProductsView } from "./components/products-view";
import { PaginatedResponse } from "@/types/shared";
import { Product } from "@/types/products";
import { PageHeader } from "@/components/shared/page-header";

export default async function ProductsPage() {
  let initialData: PaginatedResponse<Product>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<PaginatedResponse<Product>>(
      "/dashboard/products",
      { page: 1, limit: 10 }
    );
    // console.log("Fetched initial products on server:", initialData);
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
      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        <ProductsView initialProductData={initialData} />
      </div>
    </>
  );
}
