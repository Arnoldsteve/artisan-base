import { createServerApiClient } from "@/lib/server-api";
import { ProductsWrapper } from "./components/products-wrapper";
import { PaginatedResponse } from "@/types/shared";
import { Product } from "@/types/products";

export default async function ProductsPage() {
  let initialData: PaginatedResponse<Product>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<PaginatedResponse<Product>>(
      "/dashboard/products",
      { page: 1, limit: 10 }
    );
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

  return <ProductsWrapper initialProductData={initialData} />;
}
