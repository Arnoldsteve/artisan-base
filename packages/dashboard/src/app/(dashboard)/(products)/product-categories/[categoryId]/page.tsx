// page.tsx
import { createServerApiClient } from "@/lib/server-api";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";
import CategoryProductsClient from "./components/CategoryProductsClient";
import { PageHeader } from "@/components/shared/page-header";
import { PaginatedResponse } from "@/types/shared";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const resolvedParams = await params;
  const categoryId = resolvedParams["categoryId"];

  let category: Category | null = null;
  let products: Product[] = [];
  let initialProductData: PaginatedResponse<Product>;

  try {
    const serverApi = await createServerApiClient();

    // Fetch category + products in one call
    const response = await serverApi.get<{
      data: Array<{
        productId: string;
        categoryId: string;
        product: Product;
        category: Category;
      }>;
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        prev: number | null;
        next: number | null;
      };
    }>(`/dashboard/product-categories/by-category/${categoryId}`);

    if (response.data.length > 0) {
      category = response.data[0].category;
    }

    products = response.data.map((item) => item.product);

    initialProductData = {
      data: products,
      meta: response.meta,
    };
  } catch (error) {
    console.error("❌ Failed to fetch category/products:", error);
    initialProductData = {
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
    <CategoryProductsClient
      category={category}
      initialProductData={initialProductData}
    />
  );
}
