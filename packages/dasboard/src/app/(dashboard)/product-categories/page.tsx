// app/(dashboard)/product-categories/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

// Static hardcoded categories
const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets, devices, and tech accessories.",
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing, shoes, and accessories.",
  },
  {
    id: "3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Furniture, appliances, and home essentials.",
  },
  {
    id: "4",
    name: "Books",
    slug: "books",
    description: "Fiction, non-fiction, and educational books.",
  },
];

export default function ProductCategoriesPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Product Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.description && <p className="text-gray-600">{category.description}</p>}
              <Link
                href={`/dashboard/product-categories/${category.slug}`}
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
