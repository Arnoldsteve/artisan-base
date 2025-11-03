import { createServerApiClient } from "@/lib/server-api";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";
import CategoryProductsClient from "./components/CategoryProductsClient";
import { PageHeader } from "@/components/shared/page-header";

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categoryId = resolvedParams["categoryId"];
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const searchQuery = resolvedSearchParams.search || "";
  const itemsPerPage = 20;

  let category: Category | null = null;
  let products: Product[] = [];
  let totalProducts = 0;

  try {
    const serverApi = await createServerApiClient();

    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      ...(searchQuery && { search: searchQuery }),
    });

    const res = await serverApi.get<{
      data: { categoryId: string; product: Product; productId: string }[];
      totalCount?: number;
    }>(
      `/dashboard/product-categories/by-category/${categoryId}?${queryParams}`
    );

    const entries = Array.isArray(res) ? res : (res?.data ?? []);
    products = entries.map((entry: any) => entry.product);
    totalProducts = res?.totalCount || products.length;
    console.log("products", products);

    // Fetch category details
    const categoryRes = await serverApi.get<Category>(
      `/dashboard/categories/${categoryId}`
    );
    category = categoryRes;
    console.log("category", category);
  } catch (error) {
    console.error("Failed to fetch category/products:", error);
  }

  return (
    <>
      <PageHeader title={category?.name ?? "Category"} />
      <div className="px-4 md:px-4 lg:px-8 md:mt-0">
        <CategoryProductsClient
          category={category}
          products={products}
          totalProducts={totalProducts}
          searchQuery={searchQuery}
          categoryId={categoryId}
        />
      </div>
    </>
  );
}
