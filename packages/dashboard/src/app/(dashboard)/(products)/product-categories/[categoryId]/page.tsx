import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { createServerApiClient } from "@/lib/server-api";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ "category-id": string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  let category: Category | null = null;
  let products: Product[] = [];
  let totalProducts = 0;

  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const itemsPerPage = 20;
  const searchQuery = resolvedSearchParams.search || "";

  try {
    const serverApi = await createServerApiClient();

    // Build query parameters for pagination and search
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      ...(searchQuery && { search: searchQuery }),
    });

    const res = await serverApi.get<{
      data: { categoryId: string; product: Product; productId: string }[];
      totalCount?: number;
    }>(
      `/dashboard/product-categories/by-category/${resolvedParams["category-id"]}?${queryParams}`
    );

    console.log("Fetched products on server:", res);

    // Handle API response
    const entries = Array.isArray(res) ? res : (res?.data ?? []);
    products = entries.map((entry: any) => entry.product);
    totalProducts = res?.totalCount || products.length;

    // Fetch category details
    if (entries.length > 0 || searchQuery) {
      try {
        const categoryRes = await serverApi.get<Category>(
          `/dashboard/product-categories/${resolvedParams["category-id"]}`
        );
        category = categoryRes;
        console.log("Fetched category details:", categoryRes);
      } catch (categoryError) {
        console.error("Failed to fetch category details:", categoryError);
        category = {
          id: resolvedParams["category-id"],
          name: "Category Products",
          description: "Products for this category",
        } as Category;
      }
    }
  } catch (error) {
    console.error("Failed to fetch category/products:", error);
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  // No products found
  if (products.length === 0 && !searchQuery) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Category Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No products found in this category</p>
            <Link href="/product-categories">
              <Button className="mt-4">Back to Categories</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {category?.name || "Category Products Assigned to Products"}
          </h1>
          {category?.description && (
            <p className="text-gray-600 mt-1">{category.description}</p>
          )}
        </div>
        <Link href="/product-categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-4" method="GET">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={searchQuery}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Link
                href={`/product-categories/${resolvedParams["category-id"]}`}
              >
                <Button variant="outline">Clear</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {searchQuery ? (
            <span>
              Found {totalProducts} product{totalProducts !== 1 ? "s" : ""}
              {totalProducts > 0 && (
                <>
                  {" "}
                  (showing {startItem}-{endItem})
                </>
              )}
            </span>
          ) : (
            <span>
              Showing {startItem}-{endItem} of {totalProducts} products
            </span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-xs truncate"
                        title={product.description}
                      >
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {Number(product.price).toLocaleString("en-KE", {
                          style: "currency",
                          currency: "KES",
                        })}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/products/${product.id}`}>
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : "No products found in this category"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/dashboard/product-categories/${resolvedParams["category-id"]}?page=${Math.max(1, currentPage - 1)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
          >
            <Button variant="outline" disabled={currentPage <= 1} size="sm">
              Previous
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Link
                  key={pageNum}
                  href={`/product-categories/${resolvedParams["category-id"]}?page=${pageNum}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                >
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/product-categories/${resolvedParams["category-id"]}?page=${Math.min(totalPages, currentPage + 1)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
          >
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              size="sm"
            >
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
