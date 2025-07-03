import { createServerApiClient } from "@/services/server-api";
import { ProductsView } from "./components/products-view";
import { Product } from "@/types/products";

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get("/dashboard/products");

    products = response.data.data;

    if (!products) {
      console.warn("API response did not contain a 'data' array for products.");
      products = [];
    }
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <ProductsView initialProducts={products} />
    </div>
  );
}
