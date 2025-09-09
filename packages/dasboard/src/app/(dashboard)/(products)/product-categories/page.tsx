import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";
import { createServerApiClient } from "@/lib/server-api";
import { Category } from "@/types/category";
import { PageHeader } from "@/components/shared/page-header";


export default async function ProductCategoriesPage() {

  let categories = null;

  try {
    const serverApi = await createServerApiClient();

    categories = await serverApi.get<{ data: Category[] }>(
      "/dashboard/categories",
      { page: 1, limit: 10 }
    );
    console.log("Fetched initial categories on server:", categories);
  } catch (error) {
    categories = { data: categories };
    console.error("Failed to fetch initial categories on server:", error);
  }

  return (
    <div className="p-8 space-y-6">
      <PageHeader title="Product Categories" description="Manage your product categories">
        <Button> Add Category </Button>
      </PageHeader>
      {/* <h1 className="text-3xl font-bold">Product Categories</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: Category) => (
          <Card key={category.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
              <Link
                href={`/dashboard/categories/${category.slug}`}
                className="inline-block text-blue-500"
              >
                View Products
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
